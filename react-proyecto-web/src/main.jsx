import React from 'react';
import ReactDOM from 'react-dom/client';
import RegistroMaterial from './componentes/RegistroMaterial'; 
import GestionMaterial from './componentes/GestionMaterial'; 
import RegistroHerramienta from './componentes/RegistroHerramienta'; 
import GestionHerramienta from './componentes/GestionHerramienta'; 
import ListaMaterial from './componentes/ListaMaterial'; 
import ListaHerramienta from './componentes/ListaHerramienta';
import GestionProveedor from './componentes/GestionProveedor'; 
import ListaProveedor from './componentes/ListaProveedor';

// ✅ Importación del componente de trabajadores
import GestionTrabajador from './componentes/GestionTrabajador'; 

import './index.css'; 

// Captura de parámetros de la URL para navegación dinámica
const params = new URLSearchParams(window.location.search);
const vistaActual = params.get('view');

// 1. Gestión de Materiales
const rootMaterial = document.getElementById('root-gestion-material');
if (rootMaterial) {
    ReactDOM.createRoot(rootMaterial).render(
        <React.StrictMode>
            {vistaActual === 'material1' && <RegistroMaterial />}
            {vistaActual === 'material2' && <GestionMaterial />}
        </React.StrictMode>
    );
}

// 2. Gestión de Herramientas
const rootHerramienta = document.getElementById('root-gestion-herramienta');
if (rootHerramienta) {
    ReactDOM.createRoot(rootHerramienta).render(
        <React.StrictMode>
            {vistaActual === 'herramienta1' && <RegistroHerramienta />}
            {vistaActual === 'herramienta2' && <GestionHerramienta />}
        </React.StrictMode>
    );
}

// 3. Gestión de Proveedores
const rootProveedor = document.getElementById('root-gestion-proveedor');
if (rootProveedor) {
    ReactDOM.createRoot(rootProveedor).render(
        <React.StrictMode>
            {vistaActual === 'proveedor1' && <GestionProveedor modo="registro" />}
            {vistaActual === 'proveedor2' && <GestionProveedor modo="gestion" />}
        </React.StrictMode>
    );
}

// 4. Inventario Material (Sección Almacén)
const rootListaMat = document.getElementById('root-lista-material');
if (rootListaMat) {
    ReactDOM.createRoot(rootListaMat).render(
        <React.StrictMode><ListaMaterial /></React.StrictMode>
    );
}

// 5. Inventario Herramienta (Sección Almacén)
const rootListaHer = document.getElementById('root-lista-herramienta');
if (rootListaHer) {
    ReactDOM.createRoot(rootListaHer).render(
        <React.StrictMode><ListaHerramienta /></React.StrictMode>
    );
}

// 6. Directorio de Proveedores (Sección Almacén)
const rootListaProv = document.getElementById('root-lista-proveedor');
if (rootListaProv) {
    ReactDOM.createRoot(rootListaProv).render(
        <React.StrictMode><ListaProveedor /></React.StrictMode>
    );
}

// 7. Gestión de Trabajadores Autorizados
// Se encarga de mostrar el formulario de registro o la tabla de gestión
const rootTrabajador = document.getElementById('root-gestion-trabajador');
if (rootTrabajador) {
    ReactDOM.createRoot(rootTrabajador).render(
        <React.StrictMode>
            {/* ✅ Se vincula el componente real con los parámetros de vista */}
            {vistaActual === 'trabajador1' && <GestionTrabajador modo="registro" />}
            {vistaActual === 'trabajador2' && <GestionTrabajador modo="gestion" />}
        </React.StrictMode>
    );
}

// Verificación de salud del renderizado en consola
if (!rootMaterial && !rootHerramienta && !rootProveedor && !rootListaMat && !rootListaHer && !rootListaProv && !rootTrabajador) {
    console.warn('React: No se detectaron contenedores en esta vista del Administrador.');
}