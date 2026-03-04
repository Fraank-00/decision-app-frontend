# 🧠 Decision App – Frontend

Aplicación web desarrollada con React (Vite) que permite a los usuarios organizar y evaluar decisiones personales agregando factores con valores numéricos.

Este proyecto forma parte de una arquitectura Full Stack conectada a una API REST propia y base de datos PostgreSQL en la nube.

---

## 🌍 Demo en vivo

👉 https://decision-app-frontend-h1yo.onrender.com

---

## 🚀 Funcionalidades

- Registro e inicio de sesión de usuarios
- Autenticación mediante JWT
- Creación de decisiones
- Agregado de factores evaluables
- Consumo de API protegida
- Manejo de estado con React Hooks
- Protección de rutas según autenticación

---

## 🛠 Tecnologías utilizadas

- React
- Vite
- Axios
- JavaScript (ES6+)
- CSS
- Render (Deploy)

---

## 🔐 Seguridad

- El token JWT se almacena en localStorage
- Las rutas protegidas requieren autenticación
- Comunicación con backend vía headers Authorization

---

## 📦 Instalación local

```bash
git clone https://github.com/Fraank-00/decision-app-frontend
cd decision-app-frontend
npm install
npm run dev
