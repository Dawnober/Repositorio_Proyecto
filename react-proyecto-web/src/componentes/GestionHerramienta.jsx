import React, { useState, useEffect } from 'react';

function GestionHerramienta() {
    const [herramientas, setHerramientas] = useState([]);
    const [herramientaSeleccionada, setHerramientaSeleccionada] = useState(null); 
    
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState(''); 
    const [estado, setEstado] = useState('Disponible');
    const [descripcion, setDescripcion] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); 

    const apiUrl = window.location.origin + '/proyecto-web/api/herramientas'; 

    useEffect(() => { obtenerHerramientas(); }, []);

    const obtenerHerramientas = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setHerramientas(data);
        } catch (error) { console.error('Error:', error); }
    };

    const eliminarHerramienta = async (idEliminar) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta herramienta?')) {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}?id=${idEliminar}`, { method: 'DELETE' });
                const data = await response.json();
                if (response.ok) {
                    setMessage({ type: 'success', text: data.message });
                    obtenerHerramientas();
                } else { 
                    setMessage({ type: 'error', text: data.message });
                }
            } catch (error) { 
                setMessage({ type: 'error', text: 'Error de conexión.' });
            } finally { 
                setLoading(false);
                setTimeout(() => setMessage(null), 3000);
            }
        }
    };

    const prepararEdicion = (h) => {
        setHerramientaSeleccionada(h);
        setId(h.id_herramienta || h.id); 
        setNombre(h.nombre || '');
        setCantidad(h.cantidad || '');
        setEstado(h.estado || 'Disponible');
        setDescripcion(h.descripcion || '');
        setMessage(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const datosHerramienta = { id_herramienta: id, nombre, cantidad: parseInt(cantidad), estado, descripcion };
        try {
            const response = await fetch(apiUrl, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosHerramienta), 
            });
            const data = await response.json();
            if (response.ok) { 
                setMessage({ type: 'success', text: data.message });
                setTimeout(() => { 
                    setHerramientaSeleccionada(null); 
                    obtenerHerramientas(); 
                    setTimeout(() => setMessage(null), 3000);
                }, 1500);
            } else { setMessage({ type: 'error', text: data.message }); }
        } catch (error) { setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="seccion-centrada">
            {!herramientaSeleccionada ? (
                <div className="tabla-contenedor" style={{ width: '95%', maxWidth: '900px' }}>
                    <h2 className="titulo-seccion">
                        <i className="fa-solid fa-screwdriver-wrench"></i> Gestión de Herramientas
                    </h2>

                    {message && (
                        <div style={{ 
                            padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', fontWeight: 700, 
                            backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da', 
                            color: message.type === 'success' ? '#38761d' : '#721c24',
                            border: `1px solid ${message.type === 'success' ? '#70a75d' : '#e76c76'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <table className="tabla-gestion">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th style={{ width: '100px' }}>Nombre</th>
                                <th style={{ width: '70px' }}>Cant.</th>
                                <th style={{ width: '100px' }}>Estado</th>
                                <th style={{ width: '200px' }}>Descripción</th>
                                <th style={{ width: '170px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {herramientas.length > 0 ? (
                                herramientas.map((h) => (
                                    <tr key={h.id_herramienta || h.id}>
                                        <td style={{ fontSize: '0.85em', color: '#666' }}>{h.id_herramienta || h.id}</td>
                                        <td style={{ fontWeight: 'bold', color: '#000' }}>{h.nombre}</td>
                                        <td style={{ fontWeight: 'bold' }}>{h.cantidad}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.8em', fontWeight: 'bold',
                                                backgroundColor: h.estado === 'Disponible' ? '#e6f4ea' : '#fff8e1',
                                                color: h.estado === 'Disponible' ? '#1e7e34' : '#b8860b'
                                            }}>
                                                {h.estado}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.9em', textAlign: 'left' }}>{h.descripcion || 'Sin descripción'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => prepararEdicion(h)} 
                                                    className="btn-editar" 
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '7px 12px', 
                                                        cursor: 'pointer', 
                                                        backgroundColor: 'var(--color-principal)', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        borderRadius: '4px', 
                                                        fontSize: '0.9em'
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pen"></i> Editar
                                                </button>
                                                
                                                <button 
                                                    onClick={() => eliminarHerramienta(h.id_herramienta || h.id)} 
                                                    className="btn-eliminar" 
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '7px 12px', 
                                                        cursor: 'pointer', 
                                                        backgroundColor: '#ff0000', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        borderRadius: '4px', 
                                                        fontSize: '0.9em'
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i> Borrar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '20px' }}>No hay herramientas registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="registro-card"> 
                    <h2>Modificar Herramienta</h2>
                    {message && (
                        <div style={{ 
                            padding: '10px', margin: '10px 0 15px', borderRadius: '4px', textAlign: 'center', fontWeight: 700,
                            backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da',
                            color: message.type === 'success' ? '#38761d' : '#721c24',
                            border: `1px solid ${message.type === 'success' ? '#70a75d' : '#e76c76'}`
                        }}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleUpdate}>
                        <div className="form-group-material">
                            <label>Nombre de la Herramienta</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="form-group-material">
                            <label>Cantidad (Stock)</label>
                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                        </div>
                        <div className="form-group-material">
                            <label>Estado</label>
                            <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                <option value="Disponible">Disponible</option>
                                <option value="En Uso">En Uso</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Dañado">Dañado</option>
                            </select>
                        </div>
                        <div className="form-group-material">
                            <label>Descripción / Detalles</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button type="submit" disabled={loading} className="btn-actualizar">
                                {loading ? 'Actualizando...' : 'Actualizar Herramienta'}
                            </button>
                            <button type="button" onClick={() => setHerramientaSeleccionada(null)} style={{ backgroundColor: '#6c757d', marginTop: '0' }}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default GestionHerramienta;