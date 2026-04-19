import React, { useState, useEffect } from 'react';

function SolicitarInsumos() {
    const [materiales, setMateriales] = useState([]);
    const [herramientas, setHerramientas] = useState([]);
    const [tipoInsumo, setTipoInsumo] = useState('Material'); 
    const [idRecurso, setIdRecurso] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const idTrabajadorSesion = window.userId;

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resMat, resHer] = await Promise.all([
                    fetch('/proyecto-web/api/materiales'),
                    fetch('/proyecto-web/api/herramientas')
                ]);
                const dataMat = await resMat.json();
                const dataHer = await resHer.json();
                if (Array.isArray(dataMat)) setMateriales(dataMat);
                if (Array.isArray(dataHer)) setHerramientas(dataHer);
            } catch (err) {
                console.error("Error cargando inventarios:", err);
            }
        };
        cargarDatos();
    }, []);

    const opcionesActuales = tipoInsumo === 'Material' ? materiales : herramientas;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idTrabajadorSesion || idTrabajadorSesion === "null" || idTrabajadorSesion === "") {
            setMessage({ type: 'error', text: '❌ Error: No se detectó sesión de usuario.' });
            return;
        }
        setLoading(true);
        setMessage(null);

        const datosSolicitud = {
            id_persona: parseInt(idTrabajadorSesion), 
            tipo_insumo: tipoInsumo,
            id_recurso: parseInt(idRecurso),
            cantidad: parseInt(cantidad),
            observaciones: observaciones
        };

        try {
            const response = await fetch('/proyecto-web/api/solicitudes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosSolicitud),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: '✅ ' + (data.message || 'Solicitud enviada') });
                setIdRecurso(''); setCantidad(''); setObservaciones('');
            } else {
                setMessage({ type: 'error', text: data.message || '❌ Error en la solicitud' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    return (
            /* TARJETA BLANCA (registro-card) */
            <div className="registro-card" style={{ 
                maxWidth: '600px', 
                margin: '20px auto',
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
            }}>
                <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#cc9900' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    Solicitud de Insumos
                </h2>

                {message && (
                    <div style={{ 
                        padding: '12px', margin: '15px 0', borderRadius: '6px', textAlign: 'center', fontWeight: 700,
                        backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da',
                        color: message.type === 'success' ? '#38761d' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#70a75d' : '#e76c76'}`
                    }}>{message.text}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group-material" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tipo de Requerimiento</label>
                        <select value={tipoInsumo} onChange={(e) => { setTipoInsumo(e.target.value); setIdRecurso(''); }} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required>
                            <option value="Material">Material (Consumible)</option>
                            <option value="Herramienta">Herramienta (Devolutivo)</option>
                        </select>
                    </div>

                    <div className="form-group-material" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Seleccionar {tipoInsumo}</label>
                        <select value={idRecurso} onChange={(e) => setIdRecurso(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required>
                            <option value="">-- Seleccionar {tipoInsumo} --</option>
                            {opcionesActuales.map(item => (
                                <option key={item.id_material || item.id_herramienta || item.id} value={item.id_material || item.id_herramienta || item.id}>
                                    {item.nombre} (Stock: {item.cantidad} {item.unidad || ''})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group-material" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Cantidad Solicitada</label>
                        <input type="number" step="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Ej: 5" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
                    </div>

                    <div className="form-group-material" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Observaciones / Uso en Obra</label>
                        <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Escribe aquí el destino o uso..." rows="3" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none' }} />
                    </div>

                    <button type="submit" disabled={loading} style={{
                        backgroundColor: loading ? '#ccc' : '#cc9900',
                        color: 'white', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold'
                    }}>
                        {loading ? 'Enviando...' : 'Enviar Solicitud al Almacén'}
                    </button>
                </form>
            </div>
    );
}

export default SolicitarInsumos;