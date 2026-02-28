import React, { useState } from 'react';

function RegistroHerramienta() {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState(''); 
    const [estado, setEstado] = useState('Disponible');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const datosHerramienta = { 
            nombre, 
            cantidad: parseInt(cantidad),
            estado,
            descripcion 
        };

        try {
            const response = await fetch(window.location.origin + '/proyecto-web/api/herramientas', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosHerramienta), 
            });
            const data = await response.json();
            if (response.ok) { 
                setMessage({ type: 'success', text: data.message || 'Herramienta registrada!' });
                setNombre(''); setCantidad(''); setEstado('Disponible'); setDescripcion('');
            } else { 
                setMessage({ type: 'error', text: data.message || 'Error al registrar.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="registro-card"> 
            <h2>Registro de Herramienta</h2>
            {message && (
                <div style={{ 
                    padding: '10px', margin: '10px 0 15px', borderRadius: '4px', textAlign: 'center', fontWeight: 700,
                    backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da',
                    color: message.type === 'success' ? '#38761d' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#70a75d' : '#e76c76'}`
                }}>{message.text}</div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group-material">
                    <label htmlFor="nombre">Nombre de la Herramienta</label>
                    <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Pulidora" required />
                </div>
                <div className="form-group-material">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input type="number" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required placeholder="0" />
                </div>
                <div className="form-group-material">
                    <label htmlFor="estado">Estado Inicial</label>
                    <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="Disponible">Disponible</option>
                        <option value="En Uso">En Uso</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                        <option value="Dañado">Dañado</option>
                    </select>
                </div>
                <div className="form-group-material">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalles..." rows="4" />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Registrar Herramienta'}</button>
            </form>
        </div>
    );
}

export default RegistroHerramienta;