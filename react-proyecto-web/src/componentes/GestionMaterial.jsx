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
                setTimeout(() => { setMaterialSeleccionado(null); obtenerMateriales(); }, 1500);
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

            {!materialSeleccionado ? (
                <>
                    <h2 style={{color: '#b37d00', textAlign: 'center', marginBottom: '20px'}}>Edición de Materiales</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                        <thead>
                            <tr style={{borderBottom: '2px solid #b37d00'}}>
                                <th style={{padding: '12px'}}>Nombre</th>
                                <th style={{padding: '12px'}}>Stock</th>
                                <th style={{padding: '12px'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiales.map((m) => (
                                <tr key={m.id_material || m.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '12px'}}>{m.nombre}</td>
                                    <td style={{padding: '12px'}}>{m.cantidad} {m.unidad}</td>
                                    <td style={{padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                        <button onClick={() => prepararEdicion(m)} style={{padding: '7px 15px', cursor: 'pointer', backgroundColor: '#b37d00', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>Editar</button>
                                        <button onClick={() => eliminarMaterial(m.id_material || m.id)} style={{padding: '7px 15px', cursor: 'pointer', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h2>Modificar Material</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group-material"><label>Nombre del Material</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Cemento Gris" required /></div>
                        <div className="form-group-material"><label>Cantidad</label><input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} step="0.01" placeholder="Ej: 50.0" required /></div>
                        <div className="form-group-material"><label>Unidad</label><input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} placeholder="Ej: Kg o Bultos" required /></div>
                        <div className="form-group-material"><label>Descripción</label><textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" placeholder="Detalles adicionales del material..." /></div>
                        <button type="submit" disabled={loading}>{loading ? 'Actualizando...' : 'Actualizar Material'}</button>
                        <button type="button" onClick={() => setMaterialSeleccionado(null)} style={{ marginTop: '10px', backgroundColor: '#6c757d', color: 'white', width: '100%', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default GestionMaterial;