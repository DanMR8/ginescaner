ginescanercopia/
  docker-compose.yml
  backend/
    Dockerfile
    requirements.txt
    app/
      auth.py
      crud.py
      database.py
      main.py
      models.py
      schemas.py
      routes/
        imagenes.py
        pacientes.py
        protected.py
        sesiones.py
        users.py
    media/
  frontend/
    .gitignore
    Dockerfile
    eslint.config.js
    index.html
    package-lock.json
    package.json
    README.md
    vite.config.js
    public/
      vite.svg
    src/
      App.css
      App.jsx
      index.css
      main.jsx
      api/
        axios.js
      assets/
        react.svg
      pages/
        Login.jsx
        NuevaSesion.jsx
        Pacientes.jsx
        Register.jsx
        SubirImagenes.jsx
      services/
        api.js

#==============================================================================================

Arquitectura:

┌────────────┐      HTTP      ┌────────────┐      SQL       ┌────────────┐
│  Frontend  │ ─────────────▶ │  FastAPI   │ ─────────────▶ │   MySQL    │
│ React/Vite│               │  Backend   │               │ DB Docker │
└────────────┘               └────────────┘               └────────────┘

#==============================================================================================


Entidades principales
Tabla: usuarios
id, nombre, correo, contraseña, tipo (médico/paciente)

Tabla: pacientes
id, nombre, apellido, fecha_nacimiento, id_medico_asignado

Tabla: sesiones
id, id_paciente, id_medico, fecha, motivo, diagnóstico_previo, peso, etc.

Tabla: imagenes
id, id_sesion, path_original, path_procesado, fecha_carga

#==============================================================================================

Flujo de uso (para médicos)
Iniciar sesión (con token JWT)

Crear paciente

Buscar y seleccionar paciente

Crear sesión médica

Cargar imagen asociada a la sesión

(opcional: visualizar inferencia con IA)


#==============================================================================================

project-root/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── auth.py
│   │   └── routes/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/api.js
│   └── Dockerfile
├── docker-compose.yml


#==============================================================================================


Autenticación y Usuarios
Método	Ruta	Descripción	Requiere token
POST	/registro	Registro de nuevo usuario (médico o paciente)	❌
POST	/login	Autenticación (devuelve JWT)	❌
GET	/perfil	Obtener información del usuario autenticado	✅

👩‍⚕️👨‍⚕️ Pacientes
Método	Ruta	Descripción	Requiere token
POST	/pacientes	Crear nuevo paciente	✅ (rol médico)
GET	/pacientes	Listar pacientes del médico actual	✅
GET	/pacientes/{id}	Obtener detalles de un paciente por ID	✅

📋 Sesiones Médicas
Método	Ruta	Descripción	Requiere token
POST	/sesiones	Crear sesión médica para un paciente	✅
GET	/sesiones	Listar sesiones del médico autenticado	✅
GET	/sesiones/{id}	Ver detalles de una sesión específica	✅

🖼️ Imágenes Médicas
Método	Ruta	Descripción	Requiere token
POST	/imagenes/{id_sesion}	Subir imagen original para una sesión	✅
GET	/imagenes/ver/{id}	Obtener la imagen procesada (mock o IA)	✅
GET	/imagenes/original/{id}	Obtener la imagen original cargada	✅

🔒 Protección y seguridad
Todos los endpoints marcados con ✅ requieren autenticación JWT mediante el encabezado:

makefile
Copiar
Editar
Authorization: Bearer <token>