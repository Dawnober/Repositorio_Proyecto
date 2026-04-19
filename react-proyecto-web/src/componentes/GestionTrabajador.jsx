import React, { useState, useEffect } from 'react';

const GestionTrabajador = ({ modo }) => {
    const [trabajadores, setTrabajadores] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    
    const [formData, setFormData] = useState({
        idPersona: '',
        nombres: '',
        apellidos: '',
        identificacion: '',
        telefono: '',
        correo: '',
        password_hash: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const apiUrl = window.location.origin + '/proyecto-web/api/trabajadores';

    useEffect(() => {
        if (modo === 'gestion') obtenerTrabajadores();
    }, [modo]);

    const obtenerTrabajadores = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setTrabajadores(data);
        } catch (error) {
            console.error('Error al obtener trabajadores:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const limpiarFormulario = () => {
        setFormData({ idPersona: '', nombres: '', apellidos: '', identificacion: '', telefono: '', correo: '', password_hash: '' });
        setSeleccionado(null);
    };

    const prepararEdicion = (t) => {
        setSeleccionado(t);
        setFormData({
            idPersona: t.idPersona,
            nombres: t.nombres,
            apellidos: t.apellidos,
            identificacion: t.identificacion,
            telefono: t.telefono,
            correo: t.correo,
            password_hash: '' 
        });
        setMessage(null);
    };

    const eliminarTrabajador = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' });
                const data = await response.json();
                if (response.ok) {
                    setMessage({ type: 'success', text: data.message });
                    obtenerTrabajadores();
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
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Operación exitosa' });
                setTimeout(() => {
                    limpiarFormulario();
                    obtenerTrabajadores();
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
                        <i className="fa-solid fa-user-tie"></i> Lista de Trabajadores Autorizados
                    </h2>
                    
                    <MessageDisplay />
                    
                    <table className="tabla-gestion" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ width: '40px', padding: '10px', fontSize: '15px' }}>ID</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Trabajador</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Identificación</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Correo</th>
                                <th style={{ padding: '10px', fontSize: '15px' }}>Teléfono</th>
                                <th style={{ width: '170px', padding: '10px', fontSize: '15px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trabajadores.length > 0 ? (
                                trabajadores.map((t) => (
                                    <tr key={t.idPersona} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '6px', fontSize: '13px', color: '#888', textAlign: 'center' }}>
                                            {t.idPersona}
                                        </td>
                                        
                                        <td style={{ textAlign: 'left', padding: '6px 10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '30px', height: '30px', borderRadius: '50%',
                                                    backgroundColor: '#fdf7e6', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                }}>
                                                    <i className="fa-solid fa-user" style={{ color: '#cc9900', fontSize: '14px' }}></i>
                                                </div>
                                                
                                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                                                    <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: '15px', textTransform: 'capitalize' }}>
                                                        {t.nombres}
                                                    </span>
                                                    <span style={{ fontSize: '13px', color: '#777', textTransform: 'capitalize' }}>
                                                        {t.apellidos}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td style={{ padding: '6px 10px', fontWeight: '600', fontSize: '14px' }}>
                                            {t.identificacion}
                                        </td>
                                        <td style={{ padding: '6px 10px', fontSize: '14px' }}>
                                            {t.correo}
                                        </td>
                                        <td style={{ padding: '6px 10px', fontSize: '14px' }}>
                                            {t.telefono}
                                        </td>
                                        
                                        <td style={{ padding: '6px 10px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => prepararEdicion(t)} 
                                                    className="btn-editar" 
                                                    style={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px', 
                                                        cursor: 'pointer', 
                                                        backgroundColor: 'var(--color-principal)', 
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
                                                    onClick={() => eliminarTrabajador(t.idPersona)} 
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
                                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', fontSize: '16px' }}>No hay trabajadores registrados.</td>
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
                <h2>{seleccionado ? 'Modificar Trabajador' : 'Registrar Nuevo Trabajador'}</h2>
                <MessageDisplay />
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group-material">
                            <label>Nombres</label>
                            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
                        </div>
                        <div className="form-group-material">
                            <label>Apellidos</label>
                            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group-material">
                        <label>Cédula / Identificación</label>
                        <input type="text" name="identificacion" value={formData.identificacion} onChange={handleChange} required />
                    </div>
                    <div className="form-group-material">
                        <label>Teléfono</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className="form-group-material">
                        <label>Correo Electrónico (Usuario)</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>
                    {!seleccionado && (
                        <div className="form-group-material">
                            <label>Contraseña Inicial</label>
                            <input type="password" name="password_hash" value={formData.password_hash} onChange={handleChange} required />
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button type="submit" disabled={loading} style={{ fontSize: '16px', padding: '12px' }}>
                            {loading ? 'Procesando...' : seleccionado ? 'Actualizar Trabajador' : 'Registrar y Autorizar'}
                        </button>
                        {seleccionado && (
                            <button type="button" onClick={limpiarFormulario} style={{ backgroundColor: '#6c757d', marginTop: '0', fontSize: '16px', padding: '12px' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GestionTrabajador;