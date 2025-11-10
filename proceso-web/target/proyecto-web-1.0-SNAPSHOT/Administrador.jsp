<%-- 
Administrador.jsp - Vista principal del sistema de gestión para el rol Administrador.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YAS CONSTRUCCIONES S.A.S | Área de Administrador</title>

    <%-- Recursos CSS existentes --%>
    <%-- (Recursos): Se usa Context Path --%>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/Administrador.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/all.min.css">

    <%-- ⭐ CAMBIO 1: Carga los estilos CSS compilados de React (Vite) --%>
    <%-- CORRECCIÓN (Diagnóstico): Se usa ruta estática ABSOLUTA para evitar problemas con pageContext.request.contextPath --%>
    <link rel="stylesheet" href="/proyecto-web/static/react-build/index.css">
</head>
<body>
    
    
    <%-- 🚀 CONTENEDOR BLANCO SUPERIOR: LOGO (IZQUIERDA) Y BOTÓN (DERECHA) --%>
    <div class="top-spacer">
        <div class="logo-superior">
            <%-- 🔑 (Imagen): Ruta absoluta para la imagen --%>
            <img src="${pageContext.request.contextPath}/img/empresa2.png" alt="Logo YAS CONSTRUCCIONES S.A.S" class="img_empresa">
        </div>
        <%-- Botón de Cerrar Sesión (ARRIBA A LA DERECHA) --%>
        <form action="${pageContext.request.contextPath}/Cerrar_sesion" method="POST">
            <button type="submit" class="logout-btn">
                Cerrar Sesión 
            </button>
        </form>
    </div>
    
    
    <%-- 🚀 BARRA AMARILLA (persona-header) SÓLO CON INFORMACIÓN DEL USUARIO --%>
    <div class="persona-header">
        <div style="display: flex; align-items: center;">
            <%-- Contenedor del nombre y rol --%>
            <ul class="persona">
                <%-- DINÁMICO: Rol --%>
                <h3>${sessionScope.userRolDisplay}</h3> 
                <%-- DINÁMICO: Nombre COMPLETO --%>
                <h3 class="nombre_persona">${sessionScope.userName}</h3>
            </ul>
        </div>
    </div>

    <div class="main-layout">
    
        
        <nav class="nav-sidebar">
            <%-- LISTA LATERAL IZQUIERDO --%>
            <ul class="lista">
                <li class="botones">
                    <%-- (Navegación) --%>
                    <a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido1">
                        <i class="fa-solid fa-store"></i>Almacén
                    </a>
                </li>
                <li class="botones">
                    <%-- (Navegación) --%>
                    <a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido2">
                        <i class="fa-solid fa-boxes-stacked"></i>Material
                    </a>
                </li>
                <li class="botones">
                    <%-- (Navegación) --%>
                    <a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido3">
                        <i class="fa-solid fa-wrench"></i>Herramienta
                    </a>
                </li>
                <li class="botones">
                    <%-- (Navegación) --%>
                    <a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido4">
                        <i class="fa-solid fa-hard-hat"></i>Trabajador Autorizado
                    </a>
                </li>
                <li class="botones">
                    <%-- (Navegación) --%>
                    <a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido5">
                        <i class="fa-solid fa-truck"></i>Proveedor
                    </a>
                </li>
            </ul>
        </nav>

        <div class="main-content-area">
    
            
            <%-- 🔑 JSTL: Renderiza dinámicamente el DIV basado en lo que el Servlet puso en 'moduloActual' --%>
            <c:choose>

                <%-- Módulos de Navegación Principal --%>
                
                <c:when test="${requestScope.moduloActual eq 'contenido1'}">
                <div id="contenido1" class="contenido">
                        <h2>¿Qué quieres ver?</h2>
                        <div>
                            <%-- (Sub-navegación) --%>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen1">Material</a></li>
                            <%-- (Sub-navegación) --%>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen2">Herramienta</a></li>
                        </div>
                    </div>
                </c:when>

                <c:when test="${requestScope.moduloActual eq 'contenido2'}">
                <div id="contenido2" class="contenido">
                        <h2>¿Qué quieres hacer?</h2>
                        <div>
                            <%-- (Sub-navegación) --%>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=material1">Registrar Material</a></li>
                            <%-- (Sub-navegación) --%>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=material2">Editar Material</a></li>
                        </div>
                    </div>
                </c:when>
                
                <%-- ... (otros módulos de contenido3, contenido4, contenido5, almacen1, almacen2, etc.) ... --%>


                <%-- Módulo de Registro de Material (material1) --%>
                <c:when test="${requestScope.moduloActual eq 'material1'}">
                <div id="material1" class="registro_mat">
                    
                    <%-- ⭐ CAMBIO 2: Aquí va el contenedor DIV para React. --%>
                    <%-- El ID debe coincidir con el que configuraste en src/main.jsx (root-registro-material) --%>
                    <div id="root-registro-material">
                        </div>

                </div>
                </c:when>
    
                <%-- ... Se continúa con los <c:when> para todos los otros contenidos (material2, herramienta1, etc.) ... --%>

                <c:otherwise>
                    <%-- Mensaje por defecto si la variable no está definida --%>
                    <h1>Bienvenido, ${sessionScope.userName}. Selecciona una opción del menú.</h1>
                </c:otherwise>
            </c:choose>
    
        </div>
    </div>
    
    <%-- ⭐ CAMBIO 3: Carga el JavaScript compilado de React (index.js). --%>
    <%-- CORRECCIÓN (Diagnóstico): Se usa ruta estática ABSOLUTA para evitar problemas con pageContext.request.contextPath --%>
    <script type="module" src="/proyecto-web/static/react-build/index.js"></script> 

</body>
</html>