import React, { useState, useEffect } from 'react';

const GestionDanos = () => {
    const [herramientasDañadas, setHerramientasDañadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const apiUrl = '/proyecto-web/api/danos';

    const obtenerDanos = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Error en el servidor");
            const data = await response.json();
            setHerramientasDañadas(Array.isArray(data) ? data : []);
        } catch (error) { 
            console.error("Error:", error); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { obtenerDanos(); }, []);

    const handleGestion = async (id, nuevoEstado) => {
        const confirmar = window.confirm(`¿Seguro que deseas marcar como ${nuevoEstado}?`);
        if (!confirmar) return;

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_dano: id, estado: nuevoEstado })
            });
            if (response.ok) {
                obtenerDanos();
            }
        } catch (error) {
            console.error("Error al gestionar:", error);
        }
    };

    const datosFiltrados = herramientasDañadas.filter(item => {
        const query = busqueda.toLowerCase();
        const fechaFormateada = item.fecha_reporte ? new Date(item.fecha_reporte).toLocaleDateString().toLowerCase() : "";
        return (
            item.nombreHerramienta?.toLowerCase().includes(query) ||
            item.nombre?.toLowerCase().includes(query) || 
            item.apellido?.toLowerCase().includes(query) ||
            item.descripcion_dano?.toLowerCase().includes(query) ||
            fechaFormateada.includes(query)
        );
    });

    // Estilo de celda 
    const cellStyle = { 
        padding: '10px 5px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '14px', 
        color: '#333' 
    };

    return (
        <div className="container-danos" style={{
            padding: '25px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1000px',
            width: '100%',
            margin: '20px auto',  
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderTop: '5px solid #cc9900',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ textAlign: 'center', color: '#cc9900', marginBottom: '20px', fontWeight: 'bold', fontSize: '22px' }}>
                <i className="fa-solid fa-screwdriver-wrench" style={{ marginRight: '10px' }}></i>
                Gestión de Herramientas Averiadas
            </h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{
                        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888'
                    }}></i>
                    <input
                        type="text"
                        placeholder="Buscar herramienta, informante o reporte..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 15px 10px 45px',
                            borderRadius: '25px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#cc9900', color: 'white' }}>
                            <th style={{ ...cellStyle, width: '100px', color: 'white' }}>FECHA</th>
                            <th style={{ ...cellStyle, width: '180px', color: 'white' }}>INFORMANTE</th>
                            <th style={{ ...cellStyle, width: '140px', color: 'white' }}>HERRAMIENTA</th>
                            <th style={{ ...cellStyle, width: '220px', color: 'white' }}>REPORTE</th>
                            <th style={{ ...cellStyle, width: '65px', color: 'white' }}>CANT.</th>
                            <th style={{ ...cellStyle, width: '110px', color: 'white' }}>ESTADO</th>
                            <th style={{ ...cellStyle, width: '110px', color: 'white' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Cargando...</td></tr>
                        ) : datosFiltrados.length > 0 ? (
                            datosFiltrados.map((item) => (
                                <tr key={item.id_dano} style={{ borderBottom: '1px solid #f2f2f2' }}>
                                    {/* Fecha y Hora Recuperada */}
                                    <td style={cellStyle}>
                                        <div style={{ fontWeight: 'bold' }}>{new Date(item.fecha_reporte).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {new Date(item.fecha_reporte).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>
                                    {/* Informante con Estilo Solicitudes */}
                                    <td style={cellStyle}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', textAlign: 'left' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fdf7e6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                                                <i className="fa-solid fa-user-gear" style={{ color: '#cc9900', fontSize: '13px' }}></i>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '700', fontSize: '14px', lineHeight: '1.2' }}>{item.nombre}</span>
                                                <span style={{ fontSize: '12px', color: '#666' }}>{item.apellido}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={cellStyle}><span style={{ fontWeight: '600' }}>{item.nombreHerramienta}</span></td>
                                    <td style={{ ...cellStyle, textAlign: 'left' }}>
                                        <div style={{ fontSize: '12px', fontStyle: 'italic', wordWrap: 'break-word', maxWidth: '210px', lineHeight: '1.2' }}>
                                            {item.descripcion_dano}
                                        </div>
                                    </td>
                                    <td style={{ ...cellStyle, fontWeight: 'bold', color: '#cc9900', fontSize: '18px' }}>{item.cantidad}</td>
                                    <td style={cellStyle}>
                                        <span style={{ 
                                            padding: '5px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                                            backgroundColor: item.estado === 'Reparado' ? '#e6f4ea' : item.estado === 'Inservible' ? '#fdeced' : '#fff8e1', 
                                            color: item.estado === 'Reparado' ? '#1e7e34' : item.estado === 'Inservible' ? '#bd2130' : '#b8860b',
                                            display: 'inline-block', width: '85px' 
                                        }}>
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td style={cellStyle}>
                                        {item.estado === 'Pendiente' ? (
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                <button onClick={() => handleGestion(item.id_dano, 'Reparado')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer' }} title="Reparado">
                                                    <i className="fa-solid fa-wrench"></i>
                                                </button>
                                                <button onClick={() => handleGestion(item.id_dano, 'Inservible')} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer' }} title="Inservible">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        ) : <span style={{ color: '#bbb', fontSize: '12px', fontWeight: 'bold' }}>Finalizado</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                                    <i className="fa-solid fa-magnifying-glass-chart" style={{ fontSize: '40px', marginBottom: '10px', color: '#ddd', display: 'block' }}></i>
                                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Sin reportes de daños</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionDanos;