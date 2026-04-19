import React, { useEffect, useState } from 'react';

const ListaProveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(true);

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
        <div className="seccion-centrada">
            <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-truck"></i> Directorio de Proveedores
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th style={{ width: '30px' }}>ID</th>
                        <th style={{ width: '150px' }}>Empresa</th>
                        <th style={{ width: '65px' }}>Estado</th>
                        <th style={{ width: '80px' }}>Material</th>
                        <th style={{ width: '100px' }}>Teléfono</th>
                        <th style={{ width: '150px' }}>Dirección</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.length > 0 ? (
                        proveedores.map((p) => {
                            const estaActivo = p.activo !== false && p.id_empresa !== null;

                            return (
                                <tr key={p.id_empresa || p.id} className={!estaActivo ? 'fila-inactiva' : ''}>
                                    <td>{p.id_empresa || p.id}</td>
                                    
                                    {/* 1. Nombre en Negrita Negra */}
                                    <td style={{ color: estaActivo ? '#000000' : '#999', fontWeight: 'bold' }}>
                                        {p.empresa}
                                    </td>

                                    <td>
                                        {estaActivo ? (
                                            <span className="estado-bueno">ACTIVO</span>
                                        ) : (
                                            <span className="estado-malo" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
                                                INACTIVO
                                            </span>
                                        )}
                                    </td>

                                    <td style={{ color: estaActivo ? 'inherit' : '#999' }}>
                                        {p.nombreMaterial || 'General'}
                                    </td> 

                                    <td style={{ color: estaActivo ? 'inherit' : '#999' }}>{p.telefono}</td>

                                    <td style={{ color: estaActivo ? 'inherit' : '#999', backgroundColor: estaActivo ? 'transparent' : '#f5f5f5' }}>
                                        <i className="fa-solid fa-location-dot" style={{ fontSize: '12px', color: estaActivo ? '#888' : '#ccc', marginRight: '5px' }}></i>
                                        {p.direccion}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                No hay proveedores registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ListaProveedor;