import React, { useEffect, useState } from 'react';

const ListaHerramienta = () => {
    const [herramientas, setHerramientas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Se conecta a la API de herramientas
        fetch('/proyecto-web/api/herramientas')
            .then(response => response.json())
            .then(data => {
                setHerramientas(data);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error cargando herramientas:", error);
                setCargando(false);
            });
    }, []);

    if (cargando) return <div className="tabla-contenedor"><p>Cargando inventario de herramientas...</p></div>;

    return (
        <div className="seccion-centrada">
            <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-wrench"></i> Inventario de Herramientas
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th style={{ width: '55px' }} >ID</th>
                        <th style={{ width: '120px' }} >Fecha</th>
                        <th style={{ width: '120px' }} >Nombre</th>
                        <th style={{ width: '110px' }} >Cantidad</th>
                        <th style={{ width: '110px' }} >Estado</th>
                        <th className="col-descripcion">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {herramientas.length > 0 ? (
                        herramientas.map((her) => (
                            <tr key={her.id_herramienta}>
                                <td>{her.id_herramienta}</td>
                                <td>
                                    {her.fecha ? (
                                        <>
                                            <div style={{ fontWeight: 'bold' }}>{new Date(her.fecha).toLocaleDateString()}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {new Date(her.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </>
                                    ) : 'N/A'}
                                </td>
                                <td><strong>{her.nombre}</strong></td>
                                <td>{her.cantidad}</td>
                                
                                {/* Lógica de color dinámica basada en cantidad */}
                                <td>
                                    {her.cantidad > 0 ? (
                                        <span className="estado-bueno">Disponible</span>
                                    ) : (
                                        <span className="estado-malo">Agotado</span>
                                    )}
                                </td>

                                <td className="col-descripcion">
                                    {her.descripcion || <span style={{color: '#ccc', fontStyle: 'italic'}}>Sin descripción</span>}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{textAlign: 'center'}}>
                                No hay herramientas registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ListaHerramienta;