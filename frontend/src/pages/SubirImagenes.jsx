// SubirImagenes.jsx===================================================
// SubirImagenes.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './SubirImagenes.css';
import encabezadoImg from '../assets/Texto.png';

const SubirImagenes = () => {
  const [datosSesion, setDatosSesion] = useState(null);
  const [datosPaciente, setDatosPaciente] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const token = localStorage.getItem('token');
        const respSesion = await axios.get('/sesiones/ultima', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDatosSesion(respSesion.data);

        const respPaciente = await axios.get(`/pacientes/${respSesion.data.id_paciente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDatosPaciente(respPaciente.data);
        setDatosUsuario({
          nombre: respPaciente.data.nombre,
          apellidos: respPaciente.data.apellidos
        });
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        setMensaje("Error al cargar la información de la sesión o paciente.");
      }
    };

    cargarSesion();
  }, []);

  const handleSeleccionImagenes = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    const formateadas = files.map(f => ({
      file: f,
      descripcion: '',
      originalUrl: URL.createObjectURL(f),
      procesadaUrl: '',
      nombre_original: '',
      nombre_procesada: ''
    }));
    setImagenes(formateadas);
  };

  const analizarImagenes = async () => {
    const nuevas = [...imagenes];
    const token = localStorage.getItem('token');

    for (let i = 0; i < nuevas.length; i++) {
      const formData = new FormData();
      formData.append("file", nuevas[i].file);

      try {
        const resp = await axios.post('/imagenes/analizar', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        nuevas[i].procesadaUrl = resp.data.procesada;
        nuevas[i].nombre_original = resp.data.nombre_original;
        nuevas[i].nombre_procesada = resp.data.nombre_procesada;

      } catch (err) {
        console.error(`Error al analizar imagen ${i + 1}`, err);
      }
    }

    setImagenes(nuevas);
  };

  const guardarTodo = async () => {
    const token = localStorage.getItem('token');
    const idSesion = datosSesion?.id_sesion;

    setCargando(true);

    for (let idx = 0; idx < imagenes.length; idx++) {
      const { nombre_original, nombre_procesada, descripcion } = imagenes[idx];

      if (!descripcion.trim()) {
        setMensaje(`Falta la descripción en la imagen ${idx + 1}`);
        setCargando(false);
        return;
      }

      try {
        await axios.post(`/imagenes/${idSesion}`, {
          imagen: nombre_original,
          procesada: nombre_procesada,
          fecha: new Date().toISOString(),
          descripcion
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("❌ Error al guardar imagen:", error);
        setMensaje("Error al guardar una o más imágenes");
        setCargando(false);
        return;
      }
    }

    setMensaje("✅ Imágenes guardadas exitosamente");
    setCargando(false);
  };

  return (
    <div className="subir-imagenes-container" style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>

      <div className="contenedor-estilizado" style={{ alignSelf: 'flex-start', flexBasis: '34%', padding: 0, overflow: 'hidden' }}>
        <img src={encabezadoImg} alt="Encabezado" style={{ width: '100%', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
        <div style={{ padding: '1rem' }}>
          <h2>{datosUsuario ? `${datosUsuario.nombre} ${datosUsuario.apellidos}` : "Cargando..."}</h2>

          <details open>
            <summary><strong>Datos Generales</strong></summary>
            {datosPaciente ? (
              <ul>
                <li><strong>Fecha de nacimiento:</strong> {datosPaciente.fecha_nacimiento}</li>
                <li><strong>Teléfono:</strong> {datosPaciente.telefono}</li>
                <li><strong>Contacto emergencia:</strong> {datosPaciente.contacto_emergencia}</li>
                <li><strong>Alergias:</strong> {datosPaciente.alergias}</li>
                <li><strong>Enf. crónicas:</strong> {datosPaciente.enfermedades_cronicas}</li>
              </ul>
            ) : (
              <p>Cargando datos del paciente...</p>
            )}
          </details>

          <div style={{ marginTop: '1rem' }}>
            <h4>Datos de la sesión</h4>
            {datosSesion ? (
              <ul>
                <li><strong>Fecha:</strong> {new Date(datosSesion.fecha).toLocaleString()}</li>
                <li><strong>Motivo:</strong> {datosSesion.motivo}</li>
                <li><strong>Diagnóstico previo:</strong> {datosSesion.diagnostico_previo}</li>
                <li><strong>Peso:</strong> {datosSesion.peso} kg</li>
                <li><strong>Paridad:</strong> {datosSesion.paridad}</li>
                <li><strong>Etapa reproductiva:</strong> {datosSesion.etapa_reproductiva}</li>
                <li><strong>Tratamientos anticonceptivos:</strong> {datosSesion.tratamientos_anticonceptivos}</li>
                <li><strong>Plan:</strong> {datosSesion.plan}</li>
                <li><strong>Anotaciones:</strong> {datosSesion.anotaciones}</li>
              </ul>
            ) : (
              <p>Cargando datos de la sesión...</p>
            )}
          </div>
        </div>
      </div>

      <div className="contenedor-estilizado" style={{ flexBasis: '66%', transition: 'opacity 0.3s', opacity: cargando ? 0.6 : 1, pointerEvents: cargando ? 'none' : 'auto' }}>
        <h3>Subir imágenes</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <input type="file" accept="image/*" multiple onChange={handleSeleccionImagenes} />
          <button onClick={analizarImagenes} disabled={cargando} style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: cargando ? '#999' : '#007BFF', color: 'white', border: 'none' }}>
            {cargando ? 'Procesando...' : 'Analizar'}
          </button>
          <button onClick={guardarTodo} disabled={cargando} style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', fontWeight: 'bold' }}>
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        {imagenes.length > 0 && (
          <div style={{ maxHeight: '500px', overflowY: 'auto', marginTop: '1rem', paddingRight: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {imagenes.map((img, idx) => (
                <React.Fragment key={idx}>
                  <div>
                    <img src={URL.createObjectURL(img.file)} alt={`original-${idx}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover', border: '2px solid #007BFF' }} />
                  </div>
                  <div>
                    {img.procesadaUrl ? (
                      <img src={img.procesadaUrl} alt={`procesada-${idx}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover', border: '2px solid #28a745' }} />
                    ) : (
                      <div style={{ width: '100%', minHeight: '150px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #bbb' }}>
                        <span style={{ color: '#999' }}>Procesando...</span>
                      </div>
                    )}
                  </div>
                  <div style={{ gridColumn: '1 / span 2' }}>
                    <label>
                      <strong>Descripción para imagen {idx + 1}:</strong>
                      <textarea
                        rows={2}
                        style={{ width: '100%', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.5rem', padding: '0.5rem' }}
                        placeholder="Ej. Imagen con mioma hipoecoico de 3 cm..."
                        onChange={(e) => {
                          const nuevas = [...imagenes];
                          nuevas[idx] = { ...nuevas[idx], descripcion: e.target.value };
                          setImagenes(nuevas);
                        }}
                      />
                    </label>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {mensaje && <p style={{ color: mensaje.startsWith('✅') ? 'green' : 'red' }}>{mensaje}</p>}
      </div>
    </div>
  );
};

export default SubirImagenes;
// SubirImagenes.jsx===================================================
