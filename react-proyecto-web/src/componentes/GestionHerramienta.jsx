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
                setTimeout(() => { setHerramientaSeleccionada(null); obtenerHerramientas(); }, 1500);
            } else { setMessage({ type: 'error', text: data.message }); }
        } catch (error) { setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="registro-card"> 
            {message && (
                <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', fontWeight: 700, backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da', color: message.type === 'success' ? '#38761d' : '#721c24' }}>
                    {message.text}
                </div>
            )}

            {!herramientaSeleccionada ? (
                <>
                    <h2 style={{color: '#b37d00', textAlign: 'center', marginBottom: '20px'}}>Edición de Herramientas</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                        <thead>
                            <tr style={{borderBottom: '2px solid #b37d00'}}>
                                <th style={{padding: '12px'}}>Nombre</th>
                                <th style={{padding: '12px'}}>Stock</th>
                                <th style={{padding: '12px'}}>Estado</th>
                                <th style={{padding: '12px'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {herramientas.map((h) => (
                                <tr key={h.id_herramienta || h.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '12px'}}>{h.nombre}</td>
                                    <td style={{padding: '12px'}}>{h.cantidad}</td>
                                    <td style={{padding: '12px'}}>{h.estado}</td>
                                    <td style={{padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                        <button onClick={() => prepararEdicion(h)} style={{padding: '7px 15px', cursor: 'pointer', backgroundColor: '#b37d00', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>Editar</button>
                                        <button onClick={() => eliminarHerramienta(h.id_herramienta || h.id)} style={{padding: '7px 15px', cursor: 'pointer', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h2>Modificar Herramienta</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group-material"><label>Nombre</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Martillo de uña" required /></div>
                        <div className="form-group-material"><label>Cantidad</label><input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Ej: 10" required /></div>
                        <div className="form-group-material">
                            <label>Estado</label>
                            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                                <option value="Disponible">Disponible</option>
                                <option value="En Uso">En Uso</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Dañado">Dañado</option>
                            </select>
                        </div>
                        <div className="form-group-material"><label>Descripción</label><textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" placeholder="Ubicación o estado detallado..." /></div>
                        <button type="submit" disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar Herramienta'}</button>
                        <button type="button" onClick={() => setHerramientaSeleccionada(null)} style={{ marginTop: '10px', backgroundColor: '#6c757d', color: 'white', width: '100%', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default GestionHerramienta;