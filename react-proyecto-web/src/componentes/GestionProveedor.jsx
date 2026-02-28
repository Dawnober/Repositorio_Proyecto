import React, { useState, useEffect } from 'react';

function GestionProveedor({ modo }) {
    const [proveedores, setProveedores] = useState([]);
    const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    
    const [id, setId] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [idMaterial, setIdMaterial] = useState(''); 
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const apiUrl = window.location.origin + '/proyecto-web/api/proveedores';
    const apiMateriales = window.location.origin + '/proyecto-web/api/materiales';

    useEffect(() => {
        obtenerMateriales();
        if (modo === 'gestion') obtenerProveedores();
    }, [modo]);

    const obtenerMateriales = async () => {
        try {
            const response = await fetch(apiMateriales);
            const data = await response.json();
            setMaterialesDisponibles(data);
        } catch (error) {
            console.error('Error al obtener materiales:', error);
        }
    };

    const obtenerProveedores = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setProveedores(data);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    const limpiarFormulario = () => {
        setEmpresa(''); setIdMaterial(''); setTelefono(''); setDireccion(''); setId('');
        setSeleccionado(null);
    };

    const eliminarProveedor = async (idEliminar) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}?id=${idEliminar}`, { method: 'DELETE' });
                const data = await response.json();
                if (response.ok) {
                    setMessage({ type: 'success', text: data.message });
                    obtenerProveedores();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idMaterial) {
            setMessage({ type: 'error', text: 'Seleccione un material válido.' });
            return;
        }
        setLoading(true);
        const metodo = seleccionado ? 'PUT' : 'POST';
        const body = { 
            id_empresa: id ? parseInt(id) : 0, 
            empresa, 
            id_material: parseInt(idMaterial), 
            telefono, 
            direccion 
        };

        try {
            const response = await fetch(apiUrl, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Operación exitosa' });
                if (!seleccionado) limpiarFormulario();
                else {
                    setTimeout(() => { 
                        setSeleccionado(null); 
                        obtenerProveedores(); 
                    }, 1500);
                }
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally { 
            setLoading(false); 
            // Limpiar el mensaje automáticamente después de 3 segundos
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const prepararEdicion = (p) => {
        setSeleccionado(p);
        setId(p.id_empresa);
        setEmpresa(p.empresa);
        setIdMaterial(p.id_material.toString()); 
        setTelefono(p.telefono);
        setDireccion(p.direccion);
        setMessage(null);
    };

    // Componente de Mensaje reutilizable
    const MessageDisplay = () => message && (
        <div style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            borderRadius: '4px', 
            textAlign: 'center', 
            fontWeight: 700, 
            backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da', 
            color: message.type === 'success' ? '#38761d' : '#721c24' 
        }}>
            {message.text}
        </div>
    );

    if (modo === 'gestion' && !seleccionado) {
        return (
            <div className="registro-card">
                <h2 style={{color: '#b37d00', marginBottom: '20px'}}>Administrar Proveedores</h2>
                
                <MessageDisplay />

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr style={{borderBottom: '2px solid #b37d00'}}>
                            <th style={{padding: '12px'}}>Empresa</th>
                            <th style={{padding: '12px'}}>Material</th>
                            <th style={{padding: '12px'}}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map((p) => (
                            <tr key={p.id_empresa} style={{borderBottom: '1px solid #eee'}}>
                                <td style={{padding: '12px'}}>{p.empresa}</td>
                                <td style={{padding: '12px'}}>{p.nombreMaterial}</td>
                                <td style={{padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                    <button onClick={() => prepararEdicion(p)} style={{padding: '7px 12px', backgroundColor: '#b37d00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Editar</button>
                                    <button onClick={() => eliminarProveedor(p.id_empresa)} style={{padding: '7px 12px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="registro-card">
            <h2>{seleccionado ? 'Modificar Proveedor' : 'Registro de Proveedor'}</h2>
            
            <MessageDisplay />

            <form onSubmit={handleSubmit}>
                <div className="form-group-material">
                    <label>Nombre de la Empresa</label>
                    <input 
                        type="text" 
                        value={empresa} 
                        onChange={(e) => setEmpresa(e.target.value)} 
                        placeholder="Ej: Cementos Argos S.A." 
                        required 
                    />
                </div>
                <div className="form-group-material">
                    <label>Material que Suministra</label>
                    <select value={idMaterial} onChange={(e) => setIdMaterial(e.target.value)} required style={{width: '100%', padding: '10px'}}>
                        <option value="">Seleccione un material...</option>
                        {materialesDisponibles.map(m => (<option key={m.id_material} value={m.id_material}>{m.nombre}</option>))}
                    </select>
                </div>
                <div className="form-group-material">
                    <label>Teléfono</label>
                    <input 
                        type="text" 
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)} 
                        placeholder="Ej: 3124567890" 
                        required 
                    />
                </div>
                <div className="form-group-material">
                    <label>Dirección</label>
                    <input 
                        type="text" 
                        value={direccion} 
                        onChange={(e) => setDireccion(e.target.value)} 
                        placeholder="Ej: Calle 10 # 5-20, Zona Industrial" 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Procesando...' : seleccionado ? 'Actualizar' : 'Registrar'}</button>
                {seleccionado && (
                    <button type="button" onClick={limpiarFormulario} style={{marginTop: '10px', width: '100%', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer'}}>Cancelar</button>
                )}
            </form>
        </div>
    );
}

export default GestionProveedor;