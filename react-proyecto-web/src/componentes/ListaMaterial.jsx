import React, { useEffect, useState } from 'react';

const ListaMaterial = () => {
    const [materiales, setMateriales] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Se conecta a la API de materiales
        fetch('/proyecto-web/api/materiales')
            .then(response => response.json())
            .then(data => {
                setMateriales(data);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error cargando materiales:", error);
                setCargando(false);
            });
    }, []);

    if (cargando) return <div className="tabla-contenedor"><p>Cargando inventario de materiales...</p></div>;

    return (
        <div className="seccion-centrada">
            <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-boxes-stacked"></i> Inventario de Materiales
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th style={{ width: '55px' }}>ID</th>
                        <th style={{ width: '120px' }} >Fecha</th>
                        <th style={{ width: '120px' }} >Nombre</th>
                        <th style={{ width: '110px' }} >Cantidad</th>
                        <th style={{ width: '100px' }} >Unidad</th>
                        <th style={{ width: '110px' }} >Estado</th> 
                        <th className="col-descripcion">Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {materiales.length > 0 ? (
                        materiales.map((mat) => (
                            <tr key={mat.id_material}>
                                <td>{mat.id_material}</td>
                                
                                {/* Fecha con Hora debajo (Igual que herramientas) */}
                                <td>
                                    {mat.fecha ? (
                                        <>
                                            <div style={{ fontWeight: 'bold' }}>
                                                {new Date(mat.fecha).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {new Date(mat.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </>
                                    ) : 'N/A'}
                                </td>

                                {/* Nombre resaltado */}
                                <td><strong>{mat.nombre}</strong></td>
                                
                                <td>{mat.cantidad}</td>
                                <td>{mat.unidad}</td>

                                {/* Lógica de Estado basada en cantidad */}
                                <td>
                                    {mat.cantidad > 0 ? (
                                        <span className="estado-bueno">Disponible</span>
                                    ) : (
                                        <span className="estado-malo">Agotado</span>
                                    )}
                                </td>

                                {/* Descripción con clase para ancho especial */}
                                <td className="col-descripcion">
                                    {mat.descripcion || <span style={{color: '#ccc', fontStyle: 'italic'}}>Sin descripción</span>}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{textAlign: 'center'}}>
                                No hay materiales registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ListaMaterial;