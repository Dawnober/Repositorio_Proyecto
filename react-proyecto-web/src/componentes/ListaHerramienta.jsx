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
        <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-wrench"></i> Inventario de Herramientas
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha Ingreso</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Estado</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {herramientas.length > 0 ? (
                        herramientas.map((her) => (
                            <tr key={her.id_herramienta}>
                                <td>{her.id_herramienta}</td>
                                <td>{her.fecha ? new Date(her.fecha).toLocaleDateString() : 'N/A'}</td>
                                <td>{her.nombre}</td>
                                <td>{her.cantidad}</td>
                                <td>
                                    {/* Aplica las clases de colores que definimos en index.css */}
                                    <span className={`estado-${her.estado ? her.estado.toLowerCase().replace(" ", "-") : 'desconocido'}`}>
                                        {her.estado}
                                    </span>
                                </td>
                                <td>{her.descripcion}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" style={{textAlign: 'center'}}>No hay herramientas registradas en el inventario.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaHerramienta;