import React, { useState, useEffect } from 'react';

const PrestamosActivos = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [cantDañada, setCantDañada] = useState(0);
    const [observacionFinal, setObservacionFinal] = useState('');
    const [loading, setLoading] = useState(false);

    const cargarPrestamos = async () => {
        setLoading(true);
        try {
            const response = await fetch('/proyecto-web/api/prestamos');
            const data = await response.json();
            setPrestamos(Array.isArray(data) ? data : []);
        } catch (error) { 
            console.error("Error cargando préstamos:", error); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarPrestamos(); }, []);

    const abrirInspeccion = (p) => {
        setPrestamoSeleccionado(p);
        setCantDañada(p.cant_dano_reportado || 0);
        setObservacionFinal('');
        setModalVisible(true);
    };

    const finalizarRecepcion = async () => {
        const datos = {
            accion: "RECIBIR_ALMACEN",
            id_solicitud: prestamoSeleccionado.id_solicitud,
            cant_reportada: parseInt(cantDañada), 
            nota: observacionFinal || "Sin observaciones adicionales"
        };

        try {
            const res = await fetch('/proyecto-web/api/prestamos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (res.ok) {
                setModalVisible(false);
                cargarPrestamos();
            }
        } catch (error) {
            console.error("Error al finalizar recepción:", error);
        }
    };

    const prestamosFiltrados = prestamos.filter(p => {
        const busqueda = filtro.toLowerCase();
        const fechaSalida = p.fecha_solicitud ? new Date(p.fecha_solicitud).toLocaleDateString().toLowerCase() : "";
        const fechaEntrada = p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString().toLowerCase() : "";
        
        return (
            p.nombreTrabajador?.toLowerCase().includes(busqueda) ||
            p.apellidoTrabajador?.toLowerCase().includes(busqueda) ||
            p.nombreRecurso?.toLowerCase().includes(busqueda) ||
            fechaSalida.includes(busqueda) ||
            fechaEntrada.includes(busqueda)
        );
    });

    const cellStyle = {
        padding: '12px 8px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '14px'
    };

    return (
        <div className="container-solicitudes" style={{
            padding: '25px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '900px',
            margin: '20px auto',  
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderTop: '5px solid #cc9900',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ textAlign: 'center', color: '#cc9900', marginBottom: '25px', fontWeight: 'bold', fontSize: '22px' }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '12px' }}></i>
                Gestión de Herramientas en Obra e Historial
            </h2>

            <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{
                        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888'
                    }}></i>
                    <input
                        type="text"
                        placeholder="Buscar por trabajador, herramienta o fecha..."
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#cc9900', color: 'white' }}>
                        <th style={{ ...cellStyle, color: 'white', textAlign: 'left', paddingLeft: '20px', width: '250px' }}>TRABAJADOR</th>
                        <th style={{ ...cellStyle, color: 'white', textAlign: 'left' }}>HERRAMIENTA</th>
                        <th style={{ ...cellStyle, color: 'white', width: '80px' }}>CANT.</th>
                        <th style={{ ...cellStyle, color: 'white', width: '120px' }}>FECHA SALIDA</th>
                        <th style={{ ...cellStyle, color: 'white', width: '120px' }}>FECHA ENTRADA</th>
                        <th style={{ ...cellStyle, color: 'white', width: '110px' }}>ESTADO</th>
                        <th style={{ ...cellStyle, color: 'white', width: '130px' }}>ACCIONES</th>
                    </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Cargando datos...</td></tr>
                        ) : prestamosFiltrados.length > 0 ? (
                            prestamosFiltrados.map((p) => (
                                <tr key={p.id_solicitud} className="row-hover" style={{ 
                                    borderBottom: '1px solid #f2f2f2',
                                    backgroundColor: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#fcfcfc' : 'white',
                                    transition: 'background-color 0.2s'
                                }}>
                                    <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ 
                                                width: '30px', height: '30px', borderRadius: '50%', 
                                                backgroundColor: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#eee' : '#fdf7e6', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' 
                                            }}>
                                                <i className="fa-solid fa-user" style={{ color: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#999' : '#cc9900', fontSize: '13px' }}></i>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '700', color: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#888' : '#333' }}>{p.nombreTrabajador}</span>
                                                <span style={{ fontSize: '12px', color: '#999' }}>{p.apellidoTrabajador}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ ...cellStyle, textAlign: 'left' }}>
                                        <strong>{p.nombreRecurso}</strong>
                                        {/* Corregido a nota_dano (sin ñ) */}
                                        {p.nota_dano && <i className="fa-solid fa-triangle-exclamation" style={{color: '#d9534f', marginLeft: '8px'}} title={`Reporte: ${p.nota_dano}`}></i>}
                                    </td>
                                    
                                    <td style={{ ...cellStyle, fontWeight: 'bold', color: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#999' : '#cc9900' }}>
                                        {p.cantidad}
                                    </td>

                                    <td style={cellStyle}>
                                        <div style={{ fontWeight: '600' }}>{new Date(p.fecha_solicitud).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '11px', color: '#999' }}>
                                            {new Date(p.fecha_solicitud).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>

                                    <td style={cellStyle}>
                                        {p.fecha_devolucion ? (
                                            <>
                                                <div style={{ fontWeight: '600' }}>{new Date(p.fecha_devolucion).toLocaleDateString()}</div>
                                                <div style={{ fontSize: '11px', color: '#999' }}>
                                                    {new Date(p.fecha_devolucion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </>
                                        ) : <span style={{color: '#ccc'}}>---</span>}
                                    </td>

                                    <td style={cellStyle}>
                                        <span style={{ 
                                            padding: '5px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                                            backgroundColor: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#e6f4ea' : '#fff8e1', 
                                            color: (p.estado === 'Devuelto' || p.estado === 'Recibido') ? '#1e7e34' : '#b8860b',
                                            display: 'inline-block', minWidth: '80px'
                                        }}>
                                            {(p.estado === 'Devuelto' || p.estado === 'Recibido') ? 'Recibido' : 'En Obra'}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        {p.estado === 'Aprobado' || p.estado === 'Entregado' ? (
                                            <button 
                                                onClick={() => abrirInspeccion(p)} 
                                                style={{ backgroundColor: '#cc9900', color: 'white', border: 'none', padding: '7px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                                            >
                                                Recibir
                                            </button>
                                        ) : (
                                            <span style={{ color: '#bbb', fontSize: '14px' }}>✅</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                                    <i className="fa-solid fa-magnifying-glass-chart" style={{ fontSize: '50px', marginBottom: '15px', color: '#eee', display: 'block' }}></i>
                                    <div style={{ fontSize: '16px', fontWeight: '600' }}>No se encontraron registros</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Inspección */}
            {modalVisible && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', zIndex: 3000, backdropFilter: 'blur(2px)' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '420px', margin: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ color: '#cc9900', marginTop: 0, display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-microscope" style={{ marginRight: '10px' }}></i>
                            Inspección de Entrega
                        </h3>
                        <p style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Herramienta: <strong>{prestamoSeleccionado?.nombreRecurso}</strong>
                        </p>
                        
                        {prestamoSeleccionado?.nota_dano ? (
                            <div style={{ 
                                backgroundColor: '#fff5f5', padding: '12px', borderRadius: '8px', 
                                borderLeft: '5px solid #d9534f', marginBottom: '15px'
                            }}>
                                <small style={{ color: '#d9534f', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' }}>
                                    Reporte del Trabajador:
                                </small>
                                <span style={{ fontSize: '14px', color: '#444', fontStyle: 'italic' }}>
                                    "{prestamoSeleccionado.nota_dano}"
                                </span>
                                <div style={{ marginTop: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                                    Cant. reportada dañada: {prestamoSeleccionado.cant_dano_reportado || 0}
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>El trabajador no reportó daños.</p>
                        )}

                        <label style={{ fontWeight: 'bold', display: 'block', marginTop: '15px', fontSize: '14px' }}>Confirmar Cantidad Dañada:</label>
                        <input 
                            type="number" 
                            value={cantDañada} 
                            onChange={(e) => setCantDañada(e.target.value)} 
                            style={{ width: '100%', padding: '10px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd' }} 
                        />
                        
                        <label style={{ fontWeight: 'bold', display: 'block', marginTop: '15px', fontSize: '14px' }}>Observaciones finales del Almacén:</label>
                        <textarea 
                            value={observacionFinal} 
                            onChange={(e) => setObservacionFinal(e.target.value)} 
                            style={{ width: '100%', height: '80px', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }} 
                            placeholder="Describa el estado real en que recibe la herramienta..." 
                        />
                        
                        <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                            <button onClick={() => setModalVisible(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={finalizarRecepcion} style={{ flex: 1, padding: '12px', backgroundColor: '#cc9900', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar Recepción</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .row-hover:hover {
                    background-color: #fff9e6 !important;
                }
            `}</style>
        </div>
    );
};

export default PrestamosActivos;