import React, { useState, useEffect } from 'react';

function GestionMaterial() {
    const [materiales, setMateriales] = useState([]);
    const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
    
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [unidad, setUnidad] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const apiUrl = window.location.origin + '/proyecto-web/api/materiales';

    useEffect(() => { obtenerMateriales(); }, []);

    const obtenerMateriales = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setMateriales(data);
        } catch (error) { console.error('Error:', error); }
    };

    const eliminarMaterial = async (idEliminar) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}?id=${idEliminar}`, { method: 'DELETE' });
                const data = await response.json();
                if (response.ok) {
                    setMessage({ type: 'success', text: data.message });
                    obtenerMateriales();
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

    const prepararEdicion = (m) => {
        setMaterialSeleccionado(m);
        setId(m.id_material || m.id);
        setNombre(m.nombre || '');
        setCantidad(m.cantidad || '');
        setUnidad(m.unidad || '');
        setDescripcion(m.descripcion || '');
        setMessage(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const datosMaterial = { id_material: id, nombre, cantidad: parseFloat(cantidad), unidad, descripcion };
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosMaterial),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
                setTimeout(() => { 
                    setMaterialSeleccionado(null); 
                    obtenerMateriales(); 
                    setTimeout(() => setMessage(null), 3000);
                }, 1500);
            } else { 
                setMessage({ type: 'error', text: data.message }); 
            }
        } catch (error) { 
            setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="seccion-centrada">
            {!materialSeleccionado ? (
                /* TABLA DE GESTIÓN */
                <div className="tabla-contenedor" style={{ width: '95%', maxWidth: '900px' }}>
                    <h2 className="titulo-seccion">
                        <i className="fa-solid fa-boxes-stacked"></i> Gestión de Materiales
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
                                <th style={{ width: '90px' }}>Unidad</th>
                                <th style={{ width: '200px' }}>Descripción</th>
                                <th style={{ width: '170px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiales.length > 0 ? (
                                materiales.map((m) => (
                                    <tr key={m.id_material || m.id}>
                                        <td style={{ fontSize: '0.85em', color: '#666' }}>{m.id_material || m.id}</td>
                                        <td style={{ fontWeight: 'bold', color: '#000' }}>{m.nombre}</td>
                                        <td style={{ fontWeight: 'bold' }}>{m.cantidad}</td>
                                        <td>{m.unidad}</td>
                                        <td style={{ fontSize: '0.9em', textAlign: 'left' }}>{m.descripcion || 'Sin descripción'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button onClick={() => prepararEdicion(m)} className="btn-editar" style={{padding: '7px 12px', cursor: 'pointer', backgroundColor: 'var(--color-principal)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9em'}}>
                                                    <i className="fa-solid fa-pen"></i> Editar
                                                </button>
                                                <button onClick={() => eliminarMaterial(m.id_material || m.id)} className="btn-eliminar" style={{padding: '7px 12px', cursor: 'pointer', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.9em'}}>
                                                    <i className="fa-solid fa-trash"></i> Borrar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '20px' }}>No hay materiales registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* FORMULARIO DE EDICIÓN */
                <div className="registro-card"> 
                    <h2>Modificar Material</h2>
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
                            <label>Nombre del Material</label>
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="form-group-material">
                            <label>Cantidad (Stock)</label>
                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} step="0.01" required />
                        </div>
                        <div className="form-group-material">
                            <label>Unidad de Medida</label>
                            <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} required />
                        </div>
                        <div className="form-group-material">
                            <label>Descripción / Detalles</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button type="submit" disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar Material'}</button>
                            <button type="button" onClick={() => setMaterialSeleccionado(null)} style={{ backgroundColor: '#6c757d', marginTop: '0' }}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default GestionMaterial;