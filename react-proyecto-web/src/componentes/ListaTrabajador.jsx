import React, { useEffect, useState } from 'react';

const ListaTrabajador = () => {
    const [trabajadores, setTrabajadores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const apiUrl = window.location.origin + '/proyecto-web/api/trabajadores';

    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setTrabajadores(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setCargando(false);
            });
    }, []);

    if (cargando) return <div className="tabla-contenedor"><p>Cargando personal...</p></div>;

    return (
        <div className="tabla-contenedor">
            <h2 className="titulo-seccion">
                <i className="fa-solid fa-helmet-safety"></i> Personal Autorizado
            </h2>
            <table className="tabla-gestion">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Identificación</th>
                        <th>Correo (Usuario)</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {trabajadores.length > 0 ? (
                        trabajadores.map((t) => (
                            <tr key={t.idPersona}>
                                <td>{t.idPersona}</td>
                                <td><strong>{t.nombres} {t.apellidos}</strong></td>
                                <td>{t.identificacion}</td>
                                <td>{t.correo}</td>
                                <td>{t.telefono}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" style={{textAlign:'center'}}>No hay trabajadores registrados.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListaTrabajador;