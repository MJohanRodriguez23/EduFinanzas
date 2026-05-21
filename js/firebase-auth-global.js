// Firebase Authentication Global - Para mantener sesión en todas las páginas

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCarIgTA_l7A0r6sHeEeojuhC6qMpvofsI",
  authDomain: "edufinanzas.firebaseapp.com",
  projectId: "edufinanzas",
  storageBucket: "edufinanzas.firebasestorage.app",
  messagingSenderId: "750875629591",
  appId: "1:750875629591:web:4428705760bc9224992452",
  measurementId: "G-FK0KP06R11"
};

// Variables globales
let auth = null;
let db = null;

// Detectar si estamos dentro de la carpeta html/ o en la raíz
function _p(file) {
  return window.location.pathname.toLowerCase().includes('/html/') ? file : 'html/' + file;
}

// Esperar a que Firebase esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Dar tiempo a que los scripts de Firebase carguen
  setTimeout(function() {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      // Inicializar Firebase si no está inicializado
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      
      auth = firebase.auth();
      db = firebase.firestore();
      
      console.log('✅ Firebase Auth Global inicializado');
      
      // Escuchar cambios de autenticación
      if (auth) {
        auth.onAuthStateChanged(function(user) {
          updateAuthUI(user);
          checkAuthRequired();
        });
      }
    } else {
      console.error('Firebase no está disponible');
    }
  }, 100);
});

// Toast helper (si no existe)
if (!window.efToast) {
  window.efToast = function(msg, type='info'){
    let t = document.getElementById('efToast');
    if(!t){ 
      t=document.createElement('div'); 
      t.id='efToast'; 
      t.className='ef-toast'; 
      t.innerHTML='<i class="fas fa-info-circle"></i><span></span>'; 
      document.body.appendChild(t);
    }
    t.className='ef-toast '+type+' show';
    t.querySelector('i').className = type==='success'?'fas fa-check-circle':type==='error'?'fas fa-exclamation-circle':'fas fa-info-circle';
    t.querySelector('span').textContent=msg;
    clearTimeout(window._toastT);
    window._toastT=setTimeout(()=>t.classList.remove('show'), 3500);
  };
}

// Actualizar UI según estado de autenticación
function updateAuthUI(user) {
  const authLinks = document.querySelectorAll('.nav-links');
  
  authLinks.forEach(navLinks => {
    // Buscar el placeholder o el último link de autenticación
    const authPlaceholder = navLinks.querySelector('#auth-menu-placeholder');
    const loginLink = navLinks.querySelector('a[href="login.html"]');
    const registerLink = navLinks.querySelector('a[href="registro.html"]');
    
    if (user) {
      // Usuario autenticado
      console.log('✅ Usuario logueado:', user.email);
      
      // Crear o actualizar menú de usuario
      if (authPlaceholder) {
        authPlaceholder.innerHTML = `
          <li class="user-menu">
            <div class="user-info" onclick="toggleUserMenu()">
              <div class="user-avatar">${user.email.charAt(0).toUpperCase()}</div>
              <span class="user-name">${user.displayName || user.email.split('@')[0]}</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="user-dropdown" id="userDropdown">
              <a href="${_p('wallet.html')}">
                <i class="fas fa-wallet"></i>
                Mi Wallet
              </a>
              <a href="${_p('miProgreso.html')}">
                <i class="fas fa-chart-line"></i>
                Mi Progreso
              </a>
              <a href="${_p('configuracion.html')}">
                <i class="fas fa-cog"></i>
                Configuración
              </a>
              <a href="#" class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </a>
            </div>
          </li>
        `;
      } else if (loginLink) {
        // Reemplazar link de login con menú de usuario
        const userMenuLi = document.createElement('li');
        userMenuLi.className = 'user-menu';
        userMenuLi.innerHTML = `
          <div class="user-info" onclick="toggleUserMenu()">
            <div class="user-avatar">${user.email.charAt(0).toUpperCase()}</div>
            <span class="user-name">${user.displayName || user.email.split('@')[0]}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="user-dropdown" id="userDropdown">
            <a href="${_p('wallet.html')}">
              <i class="fas fa-wallet"></i>
              Mi Wallet
            </a>
            <a href="${_p('miProgreso.html')}">
              <i class="fas fa-chart-line"></i>
              Mi Progreso
            </a>
            <a href="${_p('configuracion.html')}">
              <i class="fas fa-cog"></i>
              Configuración
            </a>
            <a href="#" class="logout-btn" onclick="logout()">
              <i class="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </a>
          </div>
        `;
        loginLink.parentNode.replaceChild(userMenuLi, loginLink);
      }
      
      // Ocultar link de registro si existe
      if (registerLink) {
        registerLink.style.display = 'none';
      }
      
    } else {
      // Usuario no autenticado
      console.log('ℹ️ No hay sesión activa');
      
      // Restaurar links de login y registro
      if (authPlaceholder) {
        authPlaceholder.innerHTML = `
          <li><a href="login.html" class="nav-cta">Iniciar Sesión</a></li>
        `;
      }
      
      // Mostrar link de registro si estaba oculto
      if (registerLink) {
        registerLink.style.display = '';
      }
    }
  });
}

// Toggle user menu
function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function closeDropdown(e) {
      if (!e.target.closest('.user-menu')) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeDropdown);
      }
    });
  }
}

// Logout
async function logout() {
  try {
    if (!auth) return;
    await auth.signOut();
    efToast('Sesión cerrada', 'success');
    setTimeout(() => {
      window.location.href = _p('login.html');
    }, 1000);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    efToast('Error al cerrar sesión', 'error');
  }
}

// Verificar si el usuario necesita estar logueado para ver la página
function checkAuthRequired() {
  if (!auth) return;
  const authRequiredPages = ['wallet.html', 'miProgreso.html', 'configuracion.html', '/html/wallet.html', '/html/miProgreso.html', '/html/configuracion.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (authRequiredPages.includes(currentPage)) {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        efToast('Debes iniciar sesión para acceder a esta página', 'error');
        setTimeout(() => {
          window.location.href = _p('login.html');
        }, 1500);
      }
    });
  }
}

// Nota: Los listeners de auth ahora se configuran en DOMContentLoaded arriba

// Hacer funciones globales
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;

// Exportar para uso en otros scripts
window.firebaseAuth = {
  getAuth: () => auth,
  getDb: () => db,
  get currentUser() { return auth ? auth.currentUser : null; }
};
