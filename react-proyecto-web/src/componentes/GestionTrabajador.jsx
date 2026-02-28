import React, { useState, useEffect } from 'react';

const GestionTrabajador = ({ modo }) => {
    const [trabajadores, setTrabajadores] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    
    // Estado del formulario
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

    // Cargar trabajadores cuando el modo es 'gestion'
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
            password_hash: '' // La contraseña se deja vacía por seguridad al editar
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
                if (!seleccionado) {
                    limpiarFormulario();
                } else {
                    setTimeout(() => {
                        limpiarFormulario();
                        obtenerTrabajadores();
                    }, 1500);
                }
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión.' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const MessageDisplay = () => message && (
        <div style={{ 
            padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center', 
            fontWeight: 700, backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da', 
            color: message.type === 'success' ? '#38761d' : '#721c24' 
        }}>
            {message.text}
        </div>
    );

    // VISTA DE TABLA (GESTIÓN)
    if (modo === 'gestion' && !seleccionado) {
        return (
            <div className="registro-card">
                <h2 style={{color: '#b37d00', marginBottom: '20px'}}>Lista de Trabajadores Autorizados</h2>
                <MessageDisplay />
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr style={{borderBottom: '2px solid #b37d00'}}>
                            <th style={{padding: '12px'}}>Nombre</th>
                            <th style={{padding: '12px'}}>Identificación</th>
                            <th style={{padding: '12px'}}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trabajadores.map((t) => (
                            <tr key={t.idPersona} style={{borderBottom: '1px solid #eee'}}>
                                <td style={{padding: '12px'}}>{t.nombres} {t.apellidos}</td>
                                <td style={{padding: '12px'}}>{t.identificacion}</td>
                                <td style={{padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center'}}>
                                    <button onClick={() => prepararEdicion(t)} style={{padding: '7px 12px', backgroundColor: '#b37d00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Editar</button>
                                    <button onClick={() => eliminarTrabajador(t.idPersona)} style={{padding: '7px 12px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // VISTA DE FORMULARIO (REGISTRO O EDICIÓN)
    return (
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Procesando...' : seleccionado ? 'Actualizar Trabajador' : 'Registrar y Autorizar'}
                </button>
                {seleccionado && (
                    <button type="button" onClick={limpiarFormulario} style={{marginTop: '10px', width: '100%', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer'}}>Cancelar Edición</button>
                )}
            </form>
        </div>
    );
};

export default GestionTrabajador;