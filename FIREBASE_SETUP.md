# Configuración de Firebase para EduFinanzas

## Pasos para configurar tu proyecto Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `edufinanzas-tu-nombre` (reemplaza "tu-nombre")
4. Continúa con los pasos de configuración
5. Habilita Google Analytics (opcional pero recomendado)

### 2. Obtener credenciales del proyecto

1. En la consola de Firebase, ve a Configuración del proyecto (⚙️)
2. Ve a "General" → "Tus aplicaciones"
3. Si no tienes una app web, haz clic en "Agregar aplicación" → Web
4. Registra la app con el nombre "EduFinanzas Web"
5. Copia el objeto de configuración que se muestra

### 3. Actualizar archivo de configuración

Abre el archivo `firebase-config.js` y reemplaza los valores con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 4. Configurar Authentication

1. En Firebase Console, ve a "Authentication" → "Comenzar"
2. Habilita "Email/Password" en el método de inicio de sesión
3. Configura los dominios autorizados:
   - Agrega `localhost` para desarrollo
   - Agrega tu dominio de producción cuando lo tengas

### 5. Configurar Firestore Database

1. Ve a "Firestore Database" → "Crear base de datos"
2. Elige "Iniciar en modo de prueba" (para desarrollo)
3. Selecciona una ubicación cercana a tus usuarios
4. Una vez creada, ve a "Reglas" y reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer y escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcolecciones del usuario
      match /progress/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /wallet/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /transactions/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /goals/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /games/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Cursos y juegos son públicos para lectura
    match /courses/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    match /games/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 6. Configurar Email Verification

1. En Authentication → "Plantillas de email"
2. Configura la plantilla de "Verificación de dirección de correo"
3. Personaliza el mensaje con tu branding

### 7. Configurar Storage (opcional)

Si necesitas almacenar archivos (avatares, etc.):

1. Ve a "Storage" → "Comenzar"
2. Configura las reglas de seguridad:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 8. Probar la configuración

1. Abre tu proyecto localmente
2. Intenta registrar un nuevo usuario
3. Verifica que el usuario aparezca en Authentication
4. Revisa que se cree el documento en Firestore

### 9. Deploy a Firebase Hosting (opcional)

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Inicia sesión: `firebase login`
3. Inicializa hosting: `firebase init hosting`
4. Deploy: `firebase deploy`

## Estructura de datos en Firestore

### Users Collection
```
users/{userId}
├── uid: string
├── email: string
├── displayName: string
├── phone: string
├── createdAt: timestamp
├── lastLogin: timestamp
├── profileComplete: boolean
├── onboardingCompleted: boolean
└── preferences: object
```

### Progress Subcollection
```
users/{userId}/progress/{courseId}
├── userId: string
├── courseId: string
├── completedModules: array
├── currentModule: number
├── progress: number
├── completed: boolean
└── updatedAt: timestamp
```

### Wallet Subcollection
```
users/{userId}/wallet/main
├── totalSavings: number
├── totalInvestments: number
├── monthlyIncome: number
├── monthlyExpenses: number
└── updatedAt: timestamp
```

## Solución de problemas comunes

### Error: "auth/network-request-failed"
- Verifica tu conexión a internet
- Revisa que las credenciales en firebase-config.js sean correctas

### Error: "Missing or insufficient permissions"
- Revisa las reglas de seguridad de Firestore
- Asegúrate de que el usuario esté autenticado

### Error: "auth/email-already-in-use"
- El correo ya está registrado
- Ofrece opción de recuperación de contraseña

### Error: "auth/weak-password"
- Firebase requiere mínimo 6 caracteres
- Valida esto en el frontend antes de enviar

## Próximos pasos

Una vez configurado Firebase, puedes:

1. Implementar más funcionalidades en las páginas de cursos
2. Agregar gráficos reales con datos de Firestore
3. Implementar notificaciones push
4. Agregar funciones en la nube para lógica de backend
5. Configurar dominio personalizado en Firebase Hosting

## Soporte

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Consola de Firebase](https://console.firebase.google.com/)
- [Soporte de Firebase](https://firebase.google.com/support)
