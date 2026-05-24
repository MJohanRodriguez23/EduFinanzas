// ========== DATOS COMPARTIDOS DE CURSOS ==========
// Catálogo de cursos disponibles (sin progreso - eso viene de Firestore)
const CURSOS_CATALOGO = [
  {
    id: 'inversiones-basicas',
    categoria: 'Finanzas Personales',
    badgeClass: 'badge-blue',
    titulo: 'Inversiones Básicas',
    descripcion: 'Aprende los fundamentos de la inversión y cómo construir un portafolio diversificado.',
    icono: 'fas fa-piggy-bank',
    modulosTotales: 10,
    link: 'modulos.html'
  },
  {
    id: 'trading-avanzado',
    categoria: 'Trading',
    badgeClass: 'badge-gold',
    titulo: 'Trading Avanzado',
    descripcion: 'Domina las estrategias de trading y análisis técnico para operar en los mercados financieros.',
    icono: 'fas fa-chart-line',
    modulosTotales: 10,
    link: 'modulos.html'
  },
  {
    id: 'presupuesto-personal',
    categoria: 'Presupuesto',
    badgeClass: 'badge-green',
    titulo: 'Presupuesto Personal',
    descripcion: 'Aprende a crear y mantener un presupuesto efectivo para alcanzar tus metas financieras.',
    icono: 'fas fa-wallet',
    modulosTotales: 8,
    link: 'modulos.html'
  },
  {
    id: 'analisis-fundamental',
    categoria: 'Inversiones',
    badgeClass: 'badge-blue',
    titulo: 'Análisis Fundamental',
    descripcion: 'Aprende a evaluar el valor intrínseco de las empresas y tomar decisiones de inversión informadas.',
    icono: 'fas fa-search-dollar',
    modulosTotales: 12,
    link: 'registro-modulos.html'
  },
  {
    id: 'estrategias-profesionales',
    categoria: 'Trading',
    badgeClass: 'badge-gold',
    titulo: 'Estrategias Profesionales',
    descripcion: 'Aprende estrategias avanzadas usadas por traders institucionales en mercados globales.',
    icono: 'fas fa-chess',
    modulosTotales: 15,
    link: 'registro-modulos.html'
  },
  {
    id: 'inversion-criptomonedas',
    categoria: 'Crypto',
    badgeClass: 'badge-blue',
    titulo: 'Inversión en Criptomonedas',
    descripcion: 'Comprende el ecosistema crypto, análisis on-chain y gestión de wallets seguras.',
    icono: 'fas fa-coins',
    modulosTotales: 11,
    link: 'modulos.html'
  }
];

// Obtener progreso del usuario desde Firestore
async function obtenerProgresoCursos(userId) {
  try {
    if (!db) return {};
    const doc = await db.collection('userCourses').doc(userId).get();
    return doc.exists ? (doc.data().courses || {}) : {};
  } catch (error) {
    console.error('Error cargando progreso de cursos:', error);
    return {};
  }
}

// Combinar catálogo con progreso real del usuario
function mergeConProgreso(progresoUser) {
  return CURSOS_CATALOGO.map(curso => {
    const userInfo = progresoUser[curso.id] || null;
    const modulosCompletados = userInfo ? (userInfo.modulosCompletados || 0) : 0;
    const progreso = userInfo ? Math.round((modulosCompletados / curso.modulosTotales) * 100) : 0;
    const estado = !userInfo ? 'new' : progreso >= 100 ? 'done' : 'progress';
    const inscrito = !!userInfo;
    return { ...curso, modulosCompletados, progreso, estado, inscrito };
  });
}

// Renderizar cursos en la sección "Cursos relacionados" del wallet
function renderCursosWallet(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text-muted)"><i class="fas fa-circle-notch fa-spin"></i> Cargando cursos...</div>';

  // Esperar a que Firebase esté listo
  const interval = setInterval(() => {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    clearInterval(interval);

    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        container.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text-muted)"><i class="fas fa-lock" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.4"></i>Inicia sesión para ver tus cursos</div>';
        return;
      }

      const progresoUser = await obtenerProgresoCursos(user.uid);
      const cursos = mergeConProgreso(progresoUser);

      // Solo mostrar cursos donde el usuario está inscrito (en progreso o completados)
      const inscritos = cursos.filter(c => c.inscrito);

      if (inscritos.length === 0) {
        container.innerHTML = `
          <div style="grid-column:1/-1;padding:48px 32px;text-align:center;color:var(--text-muted);background:var(--dark-3);border-radius:16px;border:1px solid rgba(255,255,255,0.05)">
            <div style="font-size:3rem;margin-bottom:16px;opacity:0.4"><i class="fas fa-book-open"></i></div>
            <p style="font-size:1rem;margin-bottom:8px">No has iniciado ningún curso todavía</p>
            <p style="font-size:0.85rem">Explora nuestros cursos y comienza tu aprendizaje financiero</p>
            <a href="cursos.html" class="btn-primary-gold" style="margin-top:20px;display:inline-flex"><i class="fas fa-graduation-cap" style="margin-right:8px"></i> Ver Cursos</a>
          </div>`;
        return;
      }

      // Mostrar los 3 más relevantes: primero en progreso, luego completados
      const ordenados = [...inscritos].sort((a, b) => {
        const prioridad = { progress: 0, done: 1 };
        return (prioridad[a.estado] ?? 2) - (prioridad[b.estado] ?? 2);
      });

      container.innerHTML = '';
      ordenados.slice(0, 3).forEach((curso, i) => {
        const fillClass = curso.progreso >= 100 ? 'green' : curso.progreso > 0 ? 'blue' : '';
        const estadoTexto = curso.progreso >= 100 ? 'Completado' : curso.progreso > 0 ? `En progreso · ${curso.progreso}%` : 'No iniciado';

        const card = document.createElement('div');
        card.className = `ef-card reveal reveal-delay-${i + 1}`;
        card.innerHTML = `
          <div class="card-icon"><i class="${curso.icono}"></i></div>
          <h3>${curso.titulo}</h3>
          <p>${curso.descripcion}</p>
          <div class="progress-track"><div class="progress-fill ${fillClass}" style="width:${curso.progreso}%"></div></div>
          <div style="font-size:0.78rem;color:var(--text-muted)">${estadoTexto}</div>
        `;
        container.appendChild(card);
      });
    });
  }, 200);
}

// Renderizar cursos en la página "Mis Cursos"
function renderCursosMisCursos(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text-muted)"><i class="fas fa-circle-notch fa-spin"></i> Cargando cursos...</div>';

  // Esperar a que Firebase esté listo
  const interval = setInterval(() => {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    clearInterval(interval);

    firebase.auth().onAuthStateChanged(async (user) => {
      const progresoUser = user ? await obtenerProgresoCursos(user.uid) : {};
      const cursos = mergeConProgreso(progresoUser);

      container.innerHTML = '';

      cursos.forEach((curso, i) => {
        const delay = (i % 3) + 1;
        const progresoColor = curso.progreso >= 100 ? 'var(--green)' : curso.progreso > 0 ? 'var(--gold)' : 'var(--text-muted)';
        const fillClass = curso.progreso >= 100 ? 'green' : '';
        const badgeClass = curso.progreso >= 100 ? 'badge-green' : curso.badgeClass;
        const badgeText = curso.progreso >= 100 ? 'Completado' : curso.categoria;
        const btnClass = curso.progreso >= 100 ? 'btn-success-soft' : curso.progreso > 0 ? 'btn-primary-gold' : 'btn-ghost';
        const btnTexto = curso.progreso >= 100 ? 'Ver detalles' : curso.progreso > 0 ? 'Continuar' : 'Comenzar';
        const linkHref = curso.progreso > 0 ? 'modulos.html' : 'registro-modulos.html';

        const card = document.createElement('div');
        card.className = `ef-card reveal reveal-delay-${delay}`;
        card.setAttribute('data-status', curso.estado);
        card.innerHTML = `
          <span class="${badgeClass}">${badgeText}</span>
          <h3 style="margin-top:14px">${curso.titulo}</h3>
          <p>${curso.descripcion}</p>
          <div style="display:flex;justify-content:space-between;margin-top:16px;font-size:0.82rem"><span style="color:var(--text-muted)">Progreso</span><span style="color:${progresoColor};font-weight:600">${curso.progreso}%</span></div>
          <div class="progress-track"><div class="progress-fill ${fillClass}" style="width:${curso.progreso}%"></div></div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:16px">${curso.modulosCompletados}/${curso.modulosTotales} módulos</div>
          <a href="${linkHref}" class="${btnClass}" style="width:100%;justify-content:center">${btnTexto}</a>
        `;
        container.appendChild(card);
      });
    });
  }, 200);
}
