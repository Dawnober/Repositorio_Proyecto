import React, { useState, useEffect } from 'react';

const MisPedidosTrabajador = () => {
    const [misSolicitudes, setMisSolicitudes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);

    const emailUsuario = window.userEmail;

    useEffect(() => {
        if (emailUsuario) {
            const urlApi = `${window.location.origin}/proyecto-web/api/solicitudes?email=${encodeURIComponent(emailUsuario)}`;
            const obtenerDatos = async () => {
                setCargando(true);
                try {
                    const res = await fetch(urlApi);
                    const data = await res.json();
                    setMisSolicitudes(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Error al cargar pedidos:", error);
                } finally {
                    setCargando(false);
                }
            };
            obtenerDatos();
        }
    }, [emailUsuario]);

    // Lógica de filtrado para detectar números y coincidencias parciales
    const solicitudesFiltradas = misSolicitudes.filter(sol => {
        const filtro = busqueda.toLowerCase();
        
        // Convertimos la fecha y la cantidad a String para asegurar que el .includes() funcione con números
        const fechaStr = new Date(sol.fecha_solicitud).toLocaleDateString().toLowerCase();
        const cantidadStr = String(sol.cantidad);
        
        return (
            fechaStr.includes(filtro) ||
            sol.tipo_insumo?.toLowerCase().includes(filtro) ||
            sol.nombreRecurso?.toLowerCase().includes(filtro) ||
            sol.estado?.toLowerCase().includes(filtro) ||
            cantidadStr.includes(filtro)
        );
    });

    const cellStyle = {
        padding: '12px 5px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '13px',
        color: '#333'
    };

    return (
        <div className="container-solicitudes" style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            maxWidth: '750px', 
            margin: '20px auto',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderTop: '5px solid #cc9900'
        }}>
            
            <h2 style={{ 
                textAlign: 'center', 
                color: '#cc9900', 
                marginBottom: '20px', 
                fontWeight: 'bold', 
                fontSize: '22px' 
            }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '10px' }}></i>
                Estado de Mis Solicitudes
            </h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}> 
                    <i className="fa-solid fa-magnifying-glass" style={{
                        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '13px'
                    }}></i>
                    <input 
                        type="text" 
                        placeholder="Buscar por fecha, tipo o insumo..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 15px 10px 40px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            fontSize: '13px'
                        }}
                    />
                </div>
            </div>
            
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#cc9900' }}>
                            <th style={{ ...cellStyle, color: 'white', width: '20%' }}>FECHA</th>
                            <th style={{ ...cellStyle, color: 'white', width: '20%' }}>TIPO</th>
                            <th style={{ ...cellStyle, color: 'white', width: '25%' }}>INSUMO</th>
                            <th style={{ ...cellStyle, color: 'white', width: '15%' }}>CANT.</th>
                            <th style={{ ...cellStyle, color: 'white', width: '20%' }}>ESTADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Cargando...</td></tr>
                        ) : solicitudesFiltradas.length > 0 ? (
                            solicitudesFiltradas.map((sol) => (
                                <tr key={sol.id_solicitud} style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td style={cellStyle}>
                                        <div style={{ fontWeight: 'bold' }}>{new Date(sol.fecha_solicitud).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                            {new Date(sol.fecha_solicitud).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>
                                    <td style={cellStyle}>
                                        <span style={{
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#555',
                                            backgroundColor: sol.tipo_insumo === 'Herramienta' ? '#eddcfc' : '#e0f2fe',
                                            border: `1px solid ${sol.tipo_insumo === 'Herramienta' ? '#ce93d8' : '#bbdefb'}`,
                                            display: 'inline-block'
                                        }}>
                                            {sol.tipo_insumo}
                                        </span>
                                    </td>
                                    <td style={{ ...cellStyle, fontWeight: '600', wordWrap: 'break-word' }}>
                                        {sol.nombreRecurso}
                                    </td>
                                    <td style={{ ...cellStyle, fontWeight: 'bold', color: '#cc9900', fontSize: '16px' }}>
                                        {sol.cantidad}
                                    </td>
                                    <td style={cellStyle}>
                                        <span style={{
                                            padding: '6px 10px',
                                            borderRadius: '10px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: sol.estado === 'Aprobado' ? '#e6f4ea' : sol.estado === 'Rechazado' ? '#fdeced' : sol.estado === 'Devuelto' ? '#fff8e1' : '#f0f0f0',
                                            color: sol.estado === 'Aprobado' ? '#1e7e34' : sol.estado === 'Rechazado' ? '#bd2130' : sol.estado === 'Devuelto' ? '#b8860b' : '#333',
                                            display: 'inline-block',
                                            width: '90%',
                                            textTransform: 'uppercase'
                                        }}>
                                            {sol.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // DISEÑO PARA RESULTADOS NO ENCONTRADOS
                            <tr>
                                <td colSpan="5">
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px 0',
                                        color: '#999',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <i className="fa-solid fa-magnifying-glass-chart" style={{ fontSize: '50px', marginBottom: '10px', color: '#eee' }}></i>
                                        <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#666' }}>No se encontraron resultados</p>
                                        <p style={{ margin: '5px 0 0', fontSize: '13px' }}>Intenta con otro término de búsqueda</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MisPedidosTrabajador;