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
import GestionTrabajador from './componentes/GestionTrabajador'; 
import RecepcionPedido from './componentes/RecepcionPedido'; 
import GestionSolicitudes from './componentes/GestionSolicitudes'; 
import SolicitarInsumos from './componentes/SolicitarInsumos'; 
import MisPedidosTrabajador from './componentes/MisPedidosTrabajador';
import PrestamosActivos from './componentes/PrestamosActivos'; 
import GestionDaños from './componentes/GestionDaños'; 

// --- NUEVO IMPORT ---
import MisHerramientas from './componentes/MisHerramientas'; 

import './index.css'; 

const params = new URLSearchParams(window.location.search);
const vistaActual = params.get('view');

// 1. Gestión de Materiales (Vista Administrador)
const rootMaterial = document.getElementById('root-gestion-material');
if (rootMaterial) {
    ReactDOM.createRoot(rootMaterial).render(
        <React.StrictMode>
            {vistaActual === 'material1' && <RegistroMaterial />}
            {vistaActual === 'material2' && <GestionMaterial />}
        </React.StrictMode>
    );
}

// 2. Gestión de Herramientas (Vista Administrador)
const rootHerramienta = document.getElementById('root-gestion-herramienta');
if (rootHerramienta) {
    ReactDOM.createRoot(rootHerramienta).render(
        <React.StrictMode>
            {vistaActual === 'herramienta1' && <RegistroHerramienta />}
            {vistaActual === 'herramienta2' && <GestionHerramienta />}
            {/* Se eliminó la línea de 'danos' de aquí para que no se duplique o confunda */}
        </React.StrictMode>
    );
}

// 3. Gestión de Proveedores (Vista Administrador)
const rootProveedor = document.getElementById('root-gestion-proveedor');
if (rootProveedor) {
    ReactDOM.createRoot(rootProveedor).render(
        <React.StrictMode>
            {vistaActual === 'proveedor1' && <GestionProveedor modo="registro" />}
            {vistaActual === 'proveedor2' && <GestionProveedor modo="gestion" />}
        </React.StrictMode>
    );
}

// 4. Inventario Material (Sección Almacén / Almacenista)
const rootListaMat = document.getElementById('root-lista-material');
if (rootListaMat) {
    ReactDOM.createRoot(rootListaMat).render(
        <React.StrictMode>
            {vistaActual === 'almacen1' && <ListaMaterial />}
        </React.StrictMode>
    );
}

// 5. Inventario Herramienta (Sección Almacén / Almacenista)
const rootListaHer = document.getElementById('root-lista-herramienta');
if (rootListaHer) {
    ReactDOM.createRoot(rootListaHer).render(
        <React.StrictMode>
            {vistaActual === 'almacen2' && <ListaHerramienta />}
        </React.StrictMode>
    );
}

// 6. Directorio de Proveedores
const rootListaProv = document.getElementById('root-lista-proveedor');
if (rootListaProv) {
    ReactDOM.createRoot(rootListaProv).render(
        <React.StrictMode>
            <ListaProveedor />
        </React.StrictMode>
    );
}

// 7. Gestión de Trabajadores Autorizados
const rootTrabajador = document.getElementById('root-gestion-trabajador');
if (rootTrabajador) {
    ReactDOM.createRoot(rootTrabajador).render(
        <React.StrictMode>
            {vistaActual === 'trabajador1' && <GestionTrabajador modo="registro" />}
            {vistaActual === 'trabajador2' && <GestionTrabajador modo="gestion" />}
        </React.StrictMode>
    );
}

// 8. Recepción de Pedidos (Sección Almacenista)
const rootPedidos = document.getElementById('root-recepcion-pedido');
if (rootPedidos) {
    ReactDOM.createRoot(rootPedidos).render(
        <React.StrictMode>
            {vistaActual === 'pedidos' && <RecepcionPedido />}
        </React.StrictMode>
    );
}

// 9. Atender Solicitudes (Sección Almacenista)
const rootAtender = document.getElementById('root-atender-solicitudes');
if (rootAtender) {
    ReactDOM.createRoot(rootAtender).render(
        <React.StrictMode>
            {vistaActual === 'solicitudes' && <GestionSolicitudes />}
        </React.StrictMode>
    );
}

// 10. REALIZAR SOLICITUD (VISTA TRABAJADOR)
const rootSolicitarInsumos = document.getElementById('root-solicitar-insumos');
if (rootSolicitarInsumos) {
    ReactDOM.createRoot(rootSolicitarInsumos).render(
        <React.StrictMode>
            <SolicitarInsumos />
        </React.StrictMode>
    );
}

// 11. MIS PEDIDOS / HISTORIAL (VISTA TRABAJADOR)
const rootMisPedidos = document.getElementById('root-mis-pedidos');
if (rootMisPedidos) {
    ReactDOM.createRoot(rootMisPedidos).render(
        <React.StrictMode>
            <MisPedidosTrabajador />
        </React.StrictMode>
    );
}

// 12. CONTROL DE PRÉSTAMOS / DEVOLUCIONES (SECCIÓN ALMACENISTA)
const rootPrestamos = document.getElementById('root-control-prestamos');
if (rootPrestamos) {
    ReactDOM.createRoot(rootPrestamos).render(
        <React.StrictMode>
            {vistaActual === 'prestamos' && <PrestamosActivos />}
        </React.StrictMode>
    );
}

// 13. GESTIÓN DE DAÑOS (NUEVA SECCIÓN ESPECÍFICA)
const rootDanos = document.getElementById('root-gestion-danos');
if (rootDanos) {
    ReactDOM.createRoot(rootDanos).render(
        <React.StrictMode>
            {vistaActual === 'danos' && <GestionDaños />}
        </React.StrictMode>
    );
}

// 14. MIS HERRAMIENTAS - VISTA TRABAJADOR
const rootMisHerramientas = document.getElementById('root-mis-herramientas');
if (rootMisHerramientas) {
    ReactDOM.createRoot(rootMisHerramientas).render(
        <React.StrictMode>
            {vistaActual === 'herramientas' && <MisHerramientas />}
        </React.StrictMode>
    );
}

// Verificación de salud actualizada
if (!rootMaterial && !rootHerramienta && !rootProveedor && !rootListaMat && 
    !rootListaHer && !rootListaProv && !rootTrabajador && !rootPedidos && 
    !rootAtender && !rootSolicitarInsumos && !rootMisPedidos && !rootPrestamos && !rootDanos && !rootMisHerramientas) {
    console.warn('React: No se detectaron contenedores compatibles en esta vista.');
}