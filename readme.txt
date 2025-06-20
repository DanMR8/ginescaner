
├── ginescaner/                 # ⚠️ Esta carpeta parece estar duplicada
│   ├── .dockerignore
│   ├── docker-compose.yml
│   ├── Flujo.txt
│   ├── gitignore
│   ├── Instrucciones ginescaner.txt
│   ├── package-lock.json
│   ├── package.json
│   ├── readme.txt
│   ├── backend/
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── app/
│   │   │   ├── auth.py
│   │   │   ├── crud.py
│   │   │   ├── database.py
│   │   │   ├── main.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── routes/
│   │   │   │   ├── imagenes.py
│   │   │   │   ├── medicos.py
│   │   │   │   ├── pacientes.py
│   │   │   │   ├── protected.py
│   │   │   │   ├── sesiones.py
│   │   │   │   ├── users.py
│   │   │   │   ├── package.json  ← ⚠️ este archivo aquí no parece corresponder
│   │   │   │   └── __pycache__/ (archivos compilados)
│   │   │   └── __pycache__/ (archivos compilados)
│   │   └── media/
│   └── frontend/
│       ├── .dockerignore
│       ├── .gitignore
│       ├── Dockerfile
│       ├── eslint.config.js
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── README.md
│       ├── vite.config.js
│       ├── public/
│       │   └── vite.svg
│       └── src/
│           ├── App.css
│           ├── App.jsx
│           ├── index.css
│           ├── main.jsx
│           ├── api/
│           │   └── axios.js
│           ├── assets/
│           │   ├── fondo.jpg
│           │   ├── ginescaner.png
│           │   └── react.svg
│           ├── pages/
│           │   ├── Login.css
│           │   ├── Login.jsx
│           │   ├── NuevaSesion.jsx
│           │   ├── NuevoMedico.jsx
│           │   ├── Pacientes.css
│           │   ├── Pacientes.jsx
│           │   ├── Register.jsx
│           │   ├── SubirImagenes.css
│           │   └── SubirImagenes.jsx
│           └── services/
│               └── api.js


#==============================================================================================

Arquitectura:

┌────────────┐      HTTP      ┌────────────┐      SQL       ┌────────────┐
│  Frontend  │ ─────────────▶ │  FastAPI   │ ─────────────▶ │   MySQL    │
│ React/Vite│               │  Backend   │               │ DB Docker │
└────────────┘               └────────────┘               └────────────┘

#==============================================================================================


🧾 Tabla: User
id: Integer, PK, index

nombre: String(100)

apellidos: String(100)

email: String(100)

clave: String(100)

tipo: String(20) → define si es médico o paciente

estatus: String(20)

🩺 Tabla: Medico
id: Integer, PK, index

id_usuario / user_id: Integer, FK → users.id

nombres: String(100)

apellidos: String(100)

especialidad: String(100)

cedula: String(50)

institucion: String(100)

telefono: String(20)

correo: String(100)

🧍 Tabla: Paciente
id_paciente: Integer, PK, index

id_usuario: Integer, FK → users.id

fecha_nacimiento: Date, obligatorio

alergias: Text

enfermedades_cronicas: Text

contacto_emergencia: String(100)

telefono: String(20)

🗂 Tabla: Sesion
id_sesion: Integer, PK, index

id_medico: Integer, FK → medicos.id

id_paciente: Integer, FK → pacientes.id_paciente

fecha: DateTime, default=ahora

motivo: Text, obligatorio

diagnostico_previo: Text

peso: Decimal(5,2)

intervenciones_previas: Text

paridad: Integer

etapa_reproductiva: Enum (etapa: Prepúber, Fértil, Menopáusica…)

tratamientos_anticonceptivos: Text

plan: Text

anotaciones: Text

🖼 Tabla: Ultrasonido
id_imagen: Integer, PK, index

id_sesion: Integer, FK → sesiones.id_sesion

imagen: String(255)

path: String(255)

fecha: DateTime, obligatorio

lesiones: Text

descripcion: Text

Relaciones principales
Un usuario puede ser un médico o un paciente (relación 1:1).

Un médico puede tener muchas sesiones.

Un paciente también puede tener muchas sesiones.

Una sesión puede tener muchas imágenes de ultrasonido.

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