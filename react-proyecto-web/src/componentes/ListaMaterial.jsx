import React, { useEffect, useState } from 'react';

const ListaMaterial = () => {
    const [materiales, setMateriales] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Se conecta a la API de materiales que creaste en Java
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
        <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-boxes-stacked"></i> Inventario de Materiales
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha Ingreso</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {materiales.length > 0 ? (
                        materiales.map((mat) => (
                            <tr key={mat.id_material}>
                                <td>{mat.id_material}</td>
                                {/* Mostramos la fecha, si es nula ponemos N/A */}
                                <td>{mat.fecha || 'N/A'}</td>
                                <td>{mat.nombre}</td>
                                <td>{mat.cantidad}</td>
                                <td>{mat.unidad}</td>
                                <td>{mat.descripcion}</td>
                            </tr>
                        ))
                    ) : (
                        /* colSpan ahora es 6 debido a la nueva columna de fecha */
                        <tr>
                            <td colSpan="6" style={{textAlign: 'center'}}>
                                No hay materiales registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaMaterial;