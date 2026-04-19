import React, { useState, useEffect } from 'react';

const GestionProveedor = ({ modo }) => {
    const [proveedores, setProveedores] = useState([]);
    const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    
    const [formData, setFormData] = useState({
        id_empresa: '',
        empresa: '',
        id_material: '',
        telefono: '',
        direccion: ''
    });

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const limpiarFormulario = () => {
        setFormData({ id_empresa: '', empresa: '', id_material: '', telefono: '', direccion: '' });
        setSeleccionado(null);
    };

    const prepararEdicion = (p) => {
        setSeleccionado(p);
        setFormData({
            id_empresa: p.id_empresa,
            empresa: p.empresa,
            id_material: p.id_material.toString(),
            telefono: p.telefono,
            direccion: p.direccion
        });
        setMessage(null);
    };

    const eliminarProveedor = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' });
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
        setLoading(true);
        const metodo = seleccionado ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id_empresa: formData.id_empresa ? parseInt(formData.id_empresa) : 0,
                    id_material: parseInt(formData.id_material)
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Operación exitosa' });
                setTimeout(() => {
                    limpiarFormulario();
                    obtenerProveedores();
                    setMessage(null);
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

    const MessageDisplay = () => message && (
        <div style={{ 
            padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', 
            fontWeight: 700, backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da', 
            color: message.type === 'success' ? '#38761d' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#70a75d' : '#e76c76'}`
        }}>
            {message.text}
        </div>
    );

    if (modo === 'gestion' && !seleccionado) {
        return (
            <div className="seccion-centrada">
                <div className="tabla-contenedor" style={{ width: '95%', maxWidth: '950px' }}>
                    <h2 className="titulo-seccion">
                        <i className="fa-solid fa-truck-field"></i> Administración de Proveedores
                    </h2>
                    
                    <MessageDisplay />
                    
                    <table className="tabla-gestion" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ width: '40px', padding: '10px', fontSize: '15px' }}>ID</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Empresa</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Material</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Teléfono</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Dirección</th>
                                <th style={{ width: '170px', padding: '10px', fontSize: '15px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proveedores.length > 0 ? (
                                proveedores.map((p) => (
                                    <tr key={p.id_empresa} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '6px', fontSize: '13px', color: '#888', textAlign: 'center' }}>
                                            {p.id_empresa}
                                        </td>
                                        <td style={{ textAlign: 'left', padding: '6px 10px', fontWeight: '700', color: '#2c3e50' }}>
                                            {p.empresa}
                                        </td>
                                        <td style={{ padding: '6px 10px', fontSize: '14px' }}>
                                            <span style={{ backgroundColor: '#fff4d1', padding: '2px 8px', borderRadius: '12px', color: '#b37d00', fontWeight: 'bold', fontSize: '12px' }}>
                                                {p.nombreMaterial}
                                            </span>
                                        </td>
                                        <td style={{ padding: '6px 10px', fontSize: '14px' }}>{p.telefono}</td>
                                        <td style={{ padding: '6px 10px', fontSize: '14px' }}>{p.direccion}</td>
                                        <td style={{ padding: '6px 10px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => prepararEdicion(p)} 
                                                    className="btn-editar" 
                                                    style={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px', 
                                                        cursor: 'pointer', 
                                                        backgroundColor: '#b37d00', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        borderRadius: '4px', 
                                                        fontSize: '13px', 
                                                        fontWeight: '600' 
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pen"></i> Editar
                                                </button>
                                                
                                                <button 
                                                    onClick={() => eliminarProveedor(p.id_empresa)} 
                                                    className="btn-eliminar" 
                                                    style={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px', 
                                                        cursor: 'pointer', 
                                                        backgroundColor: '#ff0000', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        borderRadius: '4px', 
                                                        fontSize: '13px', 
                                                        fontWeight: '600' 
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
                                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', fontSize: '16px' }}>No hay proveedores registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="seccion-centrada">
            <div className="registro-card">
                <h2>{seleccionado ? 'Modificar Proveedor' : 'Registro de Proveedor'}</h2>
                <MessageDisplay />
                <form onSubmit={handleSubmit}>
                    <div className="form-group-material">
                        <label>Nombre de la Empresa</label>
                        <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Ej: Cementos Argos S.A." required />
                    </div>
                    <div className="form-group-material">
                        <label>Material que Suministra</label>
                        <select name="id_material" value={formData.id_material} onChange={handleChange} required style={{width: '100%', padding: '10px'}}>
                            <option value="">Seleccione un material...</option>
                            {materialesDisponibles.map(m => (
                                <option key={m.id_material} value={m.id_material}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group-material">
                        <label>Teléfono de Contacto</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 3124567890" required />
                    </div>
                    <div className="form-group-material">
                        <label>Dirección de la Empresa</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Ej: Calle 10 # 5-20" required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button type="submit" disabled={loading} style={{ fontSize: '16px', padding: '12px', backgroundColor: '#b37d00' }}>
                            {loading ? 'Procesando...' : seleccionado ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
                        </button>
                        {seleccionado && (
                            <button type="button" onClick={limpiarFormulario} style={{ backgroundColor: '#6c757d', marginTop: '0', fontSize: '16px', padding: '12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GestionProveedor;