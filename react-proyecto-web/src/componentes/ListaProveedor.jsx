import React, { useEffect, useState } from 'react';

const ListaProveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 1. URL Absoluta: Asegura que siempre encuentre la API sin importar la ruta actual
    const apiUrl = window.location.origin + '/proyecto-web/api/proveedores';

    useEffect(() => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Error en la red');
                return response.json();
            })
            .then(data => {
                setProveedores(data);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error cargando proveedores:", error);
                setCargando(false);
            });
    }, [apiUrl]);

    if (cargando) return <div className="tabla-contenedor"><p>Cargando directorio...</p></div>;

    return (
        <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-truck"></i> Directorio de Proveedores
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Material Suministrado</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.length > 0 ? (
                        proveedores.map((p) => (
                            // 2. Clave única consistente con GestionProveedor
                            <tr key={p.id_empresa || p.id}>
                                <td>{p.id_empresa || p.id}</td>
                                <td><strong>{p.empresa}</strong></td>
                                {/* 3. Fallback: Por si nombreMaterial llega nulo */}
                                <td>{p.nombreMaterial || 'No asignado'}</td> 
                                <td>{p.telefono}</td>
                                <td>{p.direccion}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                                No hay proveedores registrados actualmente.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaProveedor;