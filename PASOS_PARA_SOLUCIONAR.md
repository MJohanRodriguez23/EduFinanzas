# 🔥 Pasos para Solucionar el Error de Firebase

## Problema Identificado
Error: `auth/configuration-not-found`
Causa: El método de autenticación "Email/Password" no está habilitado en tu proyecto de Firebase.

## ✅ Solución Paso a Paso

### 1. Ve a Firebase Console
Abre: https://console.firebase.google.com/

### 2. Selecciona tu Proyecto
Asegúrate de estar en el proyecto **"edufinanzas"**

### 3. Habilita Authentication
1. Haz clic en **"Authentication"** (menú izquierdo)
2. Haz clic en **"Get started"** si es la primera vez
3. Ve a la pestaña **"Sign-in method"**
4. Busca **"Email/Password"** en la lista de proveedores
5. Haz clic en el lápiz ✏️ para editarlo
6. **Activa la opción** y haz clic en **"Save"**

### 4. Configura Dominios Autorizados (Importante)
1. En Authentication → Settings → **"Authorized domains"**
2. Agrega estos dominios:
   - `localhost`
   - `127.0.0.1`
   - Tu dominio de producción cuando lo tengas

### 5. Verifica Credenciales
1. Ve a **Project Settings** (⚙️)
2. En la sección **"Your apps"**
3. Copia las credenciales y compáralas con tu archivo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCarIgTA_l7A0r6sHeEeojuhC6qMpvofsI",
  authDomain: "edufinanzas.firebaseapp.com",
  projectId: "edufinanzas",
  storageBucket: "edufinanzas.firebasestorage.app",
  messagingSenderId: "750875629591",
  appId: "1:750875629591:web:4428705760bc9224992452",
  measurementId: "G-FK0KP06R11"
};
```

## 🧪 Después de Configurar

1. **Vuelve a `test-firebase.html`**
2. **Recarga la página**
3. **Ejecuta el test de autenticación**
4. Debería mostrar: ✅ Autenticación funciona correctamente

## 📋 Checklist Final

- [ ] Email/Password habilitado en Firebase Console
- [ ] Dominios autorizados configurados
- [ ] Credenciales verificadas
- [ ] Test de autenticación exitoso
- [ ] Registro de usuarios funcionando

## 🔍 Si Aún Falla

1. **Verifica que el projectId sea exactamente "edufinanzas"**
2. **Revisa que no haya espacios extraños en las credenciales**
3. **Limpia el caché del navegador**
4. **Abre Firebase en modo incógnito**

## 📞 Soporte

Si necesitas ayuda adicional:
1. **Captura de pantalla** del error en Firebase Console
2. **Mensaje exacto** que aparece en `test-firebase.html`
3. **URL completa** de tu proyecto de Firebase

Con esta configuración, tu registro debería funcionar perfectamente.
