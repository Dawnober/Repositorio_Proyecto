import React, { useState, useEffect } from 'react';

const MisHerramientas = () => {
    const [herramientas, setHerramientas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [herramientaSeleccionada, setHerramientaSeleccionada] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [cantidadDano, setCantidadDano] = useState(1);
    const [loading, setLoading] = useState(false);

    const cargarMisHerramientas = () => {
        setLoading(true);
        const emailPersona = window.userEmail;
        if (emailPersona) {
            fetch(`/proyecto-web/api/solicitudes?email=${emailPersona}`)
                .then(res => res.json())
                .then(data => {
                    const soloHerramientas = Array.isArray(data) 
                        ? data.filter(item => 
                        item.tipo_insumo === 'Herramienta' && 
                        (item.estado === 'Aprobado' || item.estado === 'Recibido' || item.estado === 'Devuelto')
                      )
                        : [];
                    setHerramientas(soloHerramientas);
                })
                .catch(err => console.error("Error al obtener herramientas:", err))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => { cargarMisHerramientas(); }, []);

    const enviarReporte = () => {
        if (!descripcion.trim()) {
            alert("Por favor, ingresa una descripción del daño.");
            return;
        }

        const datos = {
            accion: "REPORTAR_TRABAJADOR",
            id_solicitud: herramientaSeleccionada.id_solicitud,
            cant_reportada: parseInt(cantidadDano),
            nota: descripcion
        };

        fetch('/proyecto-web/api/prestamos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ Reporte enviado al almacén.");
                setModalAbierto(false);
                setDescripcion('');
                cargarMisHerramientas();
            } else {
                alert("❌ Error al guardar el reporte.");
            }
        })
        .catch(err => console.error("Error:", err));
    };

    const herramientasFiltradas = herramientas.filter(h => {
        const busqueda = filtro.toLowerCase();
        const nombreHerramienta = h.nombreRecurso?.toLowerCase() || "";
        const fechaFormateada = h.fecha_solicitud ? new Date(h.fecha_solicitud).toLocaleDateString().toLowerCase() : "";
        return nombreHerramienta.includes(busqueda) || fechaFormateada.includes(busqueda);
    });

    const cellStyle = { 
        padding: '12px 5px', 
        textAlign: 'center', 
        verticalAlign: 'middle', 
        fontSize: '14px', 
        color: '#333' 
    };
    
    const headerCellStyle = {
        ...cellStyle,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#cc9900'
    };

    return (
        <div className="container-herramientas" style={{
            padding: '25px', 
            fontFamily: 'Arial, sans-serif', 
            maxWidth: '720px',
            margin: '0 auto', 
            backgroundColor: 'white', 
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
            borderTop: '5px solid #cc9900',
            minHeight: '650px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ textAlign: 'center', color: '#cc9900', marginBottom: '25px', fontWeight: 'bold', fontSize: '22px' }}>
                <i className="fa-solid fa-toolbox" style={{ marginRight: '10px' }}></i>
                Mis Herramientas
            </h2>

            <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{
                        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888'
                    }}></i>
                    <input
                        type="text"
                        placeholder="Buscar herramienta o fecha..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 15px 12px 45px',
                            borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#cc9900' }}>
                            {/* DEFINICIÓN DE ANCHOS DE COLUMNA */}
                            <th style={{ ...headerCellStyle, width: '40px', textAlign: 'left', paddingLeft: '15px' }}>HERRAMIENTA</th>
                            <th style={{ ...headerCellStyle, width: '60px' }}>CANT.</th>
                            <th style={{ ...headerCellStyle, width: '110px' }}>ENTREGA</th>
                            <th style={{ ...headerCellStyle, width: '100px' }}>ESTADO</th>
                            <th style={{ ...headerCellStyle, width: '150px' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Cargando...</td></tr>
                        ) : herramientasFiltradas.length > 0 ? (
                            herramientasFiltradas.map((h) => {
                                const esEntregado = h.estado === 'Devuelto' || h.estado === 'Recibido';
                                const fechaObj = new Date(h.fecha_solicitud);
                                
                                return (
                                    <tr key={h.id_solicitud} className="row-hover-gray" style={{ 
                                        borderBottom: '1px solid #f2f2f2',
                                        backgroundColor: esEntregado ? '#fafafa' : 'white'
                                    }}>
                                        <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fdf7e6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
                                                    <i className="fa-solid fa-wrench" style={{ color: esEntregado ? '#bbb' : '#cc9900', fontSize: '13px' }}></i>
                                                </div>
                                                <strong style={{ color: esEntregado ? '#888' : '#333', fontWeight: '600' }}>{h.nombreRecurso}</strong>
                                            </div>
                                        </td>
                                        <td style={{ ...cellStyle, fontWeight: 'bold', color: '#cc9900', fontSize: '16px' }}>{h.cantidad}</td>
                                        <td style={cellStyle}>
                                            <div style={{ fontWeight: 'bold' }}>{fechaObj.toLocaleDateString()}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td style={cellStyle}>
                                            <span style={{
                                                padding: '5px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                                                backgroundColor: esEntregado ? '#e6f4ea' : '#fff8e1', 
                                                color: esEntregado ? '#1e7e34' : '#b8860b', 
                                                display: 'inline-block', width: '85px', textTransform: 'uppercase'
                                            }}>
                                                {esEntregado ? 'Devuelto' : 'En Uso'}
                                            </span>
                                        </td>
                                        <td style={cellStyle}>
                                            {!esEntregado ? (
                                                <button
                                                    onClick={() => { setHerramientaSeleccionada(h); setModalAbierto(true); }}
                                                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                                                >
                                                    REPORTAR DAÑO
                                                </button>
                                            ) : (
                                                <span style={{ color: '#bbb', fontSize: '12px', fontWeight: 'bold' }}>Finalizado</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
                                    <i className="fa-solid fa-folder-open" style={{ fontSize: '50px', marginBottom: '15px', color: '#ddd', display: 'block' }}></i>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>No se encontraron herramientas</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .row-hover-gray:hover { background-color: #f8f9fa !important; }
            `}</style>

            {modalAbierto && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    display: 'flex', zIndex: 3000,
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)' 
                }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '380px', margin: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ color: '#cc9900', marginTop: 0, fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{marginRight: '10px'}}></i>
                            Reportar Daño
                        </h3>
                        <p style={{ fontSize: '14px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Herramienta: <strong>{herramientaSeleccionada?.nombreRecurso}</strong>
                        </p>
                        
                        <label style={{ fontWeight: 'bold', display: 'block', marginTop: '15px', fontSize: '13px' }}>Cantidad:</label>
                        <input type="number" min="1" max={herramientaSeleccionada?.cantidad} value={cantidadDano} 
                               onChange={(e) => setCantidadDano(e.target.value)} 
                               style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
                        
                        <label style={{ fontWeight: 'bold', display: 'block', marginTop: '15px', fontSize: '13px' }}>Descripción del problema:</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} 
                                  placeholder="Explica brevemente qué le pasó a la herramienta..."
                                  style={{ width: '100%', height: '80px', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }} />
                        
                        <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                            <button onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f8f9fa' }}>Cerrar</button>
                            <button onClick={enviarReporte} style={{ flex: 1, padding: '12px', backgroundColor: '#cc9900', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar Reporte</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisHerramientas;