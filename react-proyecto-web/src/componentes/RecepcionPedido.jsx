import React, { useState, useEffect } from 'react';

function RecepcionPedido() {
    const [materiales, setMateriales] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    
    const [idMaterial, setIdMaterial] = useState('');
    const [idEmpresa, setIdEmpresa] = useState('');
    const [idPersona, setIdPersona] = useState('');
    const [nombresPersona, setNombresPersona] = useState('');
    const [apellidosPersona, setApellidosPersona] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); 

    useEffect(() => {
        fetch('/proyecto-web/api/materiales').then(res => res.json()).then(setMateriales);
        fetch('/proyecto-web/api/proveedores').then(res => res.json()).then(setProveedores);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const datosEntrada = {
            id_material: parseInt(idMaterial),
            id_empresa: parseInt(idEmpresa),
            id_persona: idPersona,
            nombres_persona: nombresPersona,
            apellidos_persona: apellidosPersona,
            cantidad: parseFloat(cantidad),
            precio: parseFloat(precio)
        };

        try {
            const response = await fetch(window.location.origin + '/proyecto-web/api/entrada-material', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosEntrada),
            });
            const data = await response.json();
            
            if (response.ok) {
                setMessage({ type: 'success', text: data.message || '✅ Entrada registrada con éxito' });
                setIdMaterial(''); setIdEmpresa(''); setIdPersona('');
                setNombresPersona(''); setApellidosPersona(''); setCantidad(''); setPrecio('');
            } else {
                setMessage({ type: 'error', text: data.message || '❌ Error al registrar.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registro-card recepcion-container">
            <h2 className="header-flex">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="#cc9900" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px', verticalAlign: 'middle'}}>
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12.5-11.5l2.25 3H17V7h1.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                Recepción de Insumos
            </h2>

            {message && (
                <div className={`alert-box ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-recepcion">
                <div className="form-group-material">
                    <label>Material Recibido</label>
                    <select value={idMaterial} onChange={(e) => setIdMaterial(e.target.value)} required>
                        <option value="">-- Seleccionar Material --</option>
                        {materiales.map(m => <option key={m.id_material} value={m.id_material}>{m.nombre}</option>)}
                    </select>
                </div>

                <div className="form-group-material">
                    <label>Empresa Proveedora</label>
                    <select value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)} required>
                        <option value="">-- Seleccionar Empresa --</option>
                        {proveedores.map(p => <option key={p.id_empresa} value={p.id_empresa}>{p.empresa}</option>)}
                    </select>
                </div>

                <div className="form-group-material">
                    <label>Identificación de la Persona (CC / NIT)</label>
                    <input type="text" value={idPersona} onChange={(e) => setIdPersona(e.target.value)} placeholder="Ej: 10203040" required />
                </div>

                <div className="form-row">
                    <div className="form-group-material">
                        <label>Nombres</label>
                        <input type="text" value={nombresPersona} onChange={(e) => setNombresPersona(e.target.value)} required />
                    </div>
                    <div className="form-group-material">
                        <label>Apellidos</label>
                        <input type="text" value={apellidosPersona} onChange={(e) => setApellidosPersona(e.target.value)} required />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group-material">
                        <label>Cantidad</label>
                        <input type="number" step="0.01" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="0" required />
                    </div>
                    <div className="form-group-material">
                        <label>Costo Total ($)</label>
                        <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="$" required />
                    </div>
                </div>

                <button type="submit" className="btn-confirmar" disabled={loading}>
                    {loading ? 'Guardando...' : 'Confirmar Ingreso'}
                </button>
            </form>
        </div>
    );
}

export default RecepcionPedido;