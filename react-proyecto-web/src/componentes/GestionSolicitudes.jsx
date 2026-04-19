import React, { useState, useEffect } from 'react';

const GestionSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(false);

    const apiUrl = window.location.origin + '/proyecto-web/api/solicitudes';

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const cargarSolicitudes = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (Array.isArray(data)) setSolicitudes(data);
        } catch (error) {
            console.error("Error al cargar:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleActualizarEstado = async (id, nuevoEstado) => {
        if (!window.confirm(`¿Estás seguro de marcar esta solicitud como ${nuevoEstado}?`)) return;
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, estado: nuevoEstado })
            });
            if (response.ok) {
                setSolicitudes(solicitudes.map(sol =>
                    sol.id_solicitud === id ? { ...sol, estado: nuevoEstado } : sol
                ));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // CORRECCIÓN: Filtrado que reconoce números de 1 dígito y cantidades
    const solicitudesFiltradas = solicitudes.filter(sol => {
        const busqueda = filtro.toLowerCase();
        
        // Convertimos explícitamente a string la fecha y la cantidad
        const fechaFormateada = new Date(sol.fecha_solicitud).toLocaleDateString().toLowerCase();
        const cantidadStr = String(sol.cantidad);

        return (
            sol.nombreRecurso?.toLowerCase().includes(busqueda) ||
            sol.estado?.toLowerCase().includes(busqueda) ||
            sol.nombreTrabajador?.toLowerCase().includes(busqueda) ||
            sol.apellidoTrabajador?.toLowerCase().includes(busqueda) ||
            sol.tipo_insumo?.toLowerCase().includes(busqueda) ||
            fechaFormateada.includes(busqueda) ||
            cantidadStr.includes(busqueda)
        );
    });

    const cellStyle = {
        padding: '12px 5px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '14px',
        color: '#333'
    };

    return (
        <div className="container-solicitudes" style={{
            padding: '25px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '850px',
            width: '100%',
            margin: '20px auto',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderTop: '5px solid #cc9900',
            minHeight: '650px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ textAlign: 'center', color: '#cc9900', marginBottom: '25px', fontWeight: 'bold', fontSize: '22px' }}>
                <i className="fa-solid fa-clipboard-list" style={{ marginRight: '10px' }}></i>
                Gestión de Solicitudes de Insumos
            </h2>

            <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{
                        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888'
                    }}></i>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o insumo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 15px 12px 45px',
                            borderRadius: '25px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#cc9900', color: 'white' }}>
                            <th style={{ ...cellStyle, width: '100px', color: 'white' }}>FECHA</th>
                            <th style={{ ...cellStyle, width: '180px', color: 'white' }}>SOLICITANTE</th>
                            <th style={{ ...cellStyle, width: '120px', color: 'white' }}>INSUMO</th>
                            <th style={{ ...cellStyle, width: '110px', color: 'white' }}>TIPO</th>
                            <th style={{ ...cellStyle, width: '65px', color: 'white' }}>CANT.</th>
                            <th style={{ ...cellStyle, width: '110px', color: 'white' }}>ESTADO</th>
                            <th style={{ ...cellStyle, width: '110px', color: 'white' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Cargando...</td></tr>
                        ) : solicitudesFiltradas.length > 0 ? (
                            solicitudesFiltradas.map((sol) => (
                                <tr key={sol.id_solicitud} style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    <td style={cellStyle}>
                                        <div style={{ fontWeight: 'bold' }}>{new Date(sol.fecha_solicitud).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {new Date(sol.fecha_solicitud).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>
                                    <td style={cellStyle}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', textAlign: 'left' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fdf7e6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                                                <i className="fa-solid fa-user" style={{ color: '#cc9900', fontSize: '13px' }}></i>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '700', fontSize: '14px', lineHeight: '1.2' }}>{sol.nombreTrabajador}</span>
                                                <span style={{ fontSize: '12px', color: '#666' }}>{sol.apellidoTrabajador}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={cellStyle}><span style={{ fontWeight: '600' }}>{sol.nombreRecurso}</span></td>
                                    <td style={cellStyle}>
                                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', backgroundColor: sol.tipo_insumo === 'Material' ? '#e0f2fe' : '#eddcfc', color: '#333', fontWeight: 'bold' }}>
                                            {sol.tipo_insumo}
                                        </span>
                                    </td>
                                    <td style={{ ...cellStyle, fontWeight: 'bold', color: '#cc9900', fontSize: '18px' }}>{sol.cantidad}</td>
                                    <td style={cellStyle}>
                                        <span style={{ padding: '5px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: sol.estado === 'Aprobado' ? '#e6f4ea' : sol.estado === 'Rechazado' ? '#fdeced' : '#fff8e1', color: sol.estado === 'Aprobado' ? '#1e7e34' : sol.estado === 'Rechazado' ? '#bd2130' : '#b8860b', display: 'inline-block', width: '85px' }}>
                                            {sol.estado}
                                        </span>
                                    </td>
                                    <td style={cellStyle}>
                                        {sol.estado === 'Pendiente' ? (
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                <button onClick={() => handleActualizarEstado(sol.id_solicitud, 'Aprobado')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-check"></i></button>
                                                <button onClick={() => handleActualizarEstado(sol.id_solicitud, 'Rechazado')} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                                            </div>
                                        ) : <span style={{ color: '#bbb', fontSize: '12px', fontWeight: 'bold' }}>Finalizado</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
                                    <i className="fa-solid fa-magnifying-glass-chart" style={{ fontSize: '50px', marginBottom: '15px', color: '#ddd', display: 'block' }}></i>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>No se encontraron resultados</div>
                                    <div style={{ fontSize: '14px', marginTop: '5px' }}>Intenta con otro término de búsqueda</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionSolicitudes;