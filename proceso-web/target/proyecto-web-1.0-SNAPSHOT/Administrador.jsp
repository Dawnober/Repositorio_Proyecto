<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YAS CONSTRUCCIONES S.A.S | Área de Administrador</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/Administrador.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/react-build/index.css">
</head>
<body>
    <div class="top-spacer">
        <div class="logo-superior">
            <img src="${pageContext.request.contextPath}/img/empresa2.png" alt="Logo" class="img_empresa">
        </div>
        <form action="${pageContext.request.contextPath}/Cerrar_sesion" method="POST">
            <button type="submit" class="logout-btn">Cerrar Sesión</button>
        </form>
    </div>
    
    <div class="persona-header">
        <ul class="persona">
            <h3>${sessionScope.userRolDisplay}</h3> 
            <h3 class="nombre_persona">${sessionScope.userName}</h3>
        </ul>
    </div>

    <div class="main-layout">
        <nav class="nav-sidebar">
            <ul class="lista">
                <li class="botones"><a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido1"><i class="fa-solid fa-store"></i> Almacén</a></li>
                <li class="botones"><a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido2"><i class="fa-solid fa-boxes-stacked"></i> Material</a></li>
                <li class="botones"><a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido3"><i class="fa-solid fa-wrench"></i> Herramienta</a></li>
                <li class="botones"><a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido4"><i class="fa-solid fa-helmet-safety"></i> Trabajador</a></li>
                <li class="botones"><a href="${pageContext.request.contextPath}/administrador/controlador?view=contenido5"><i class="fa-solid fa-truck"></i> Proveedor</a></li>
            </ul>
        </nav>

        <div class="main-content-area">
            <c:choose>
                <%-- MENÚS INTERNOS --%>
                <c:when test="${moduloActual eq 'contenido1'}">
                    <div class="contenido">
                        <h2>¿Qué quieres ver?</h2>
                        <div>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen1">Inventario Materiales</a></li>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen2">Inventario Herramientas</a></li>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen3">Directorio de Proveedores</a></li>
                        </div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'contenido2'}">
                    <div class="contenido">
                        <h2>Gestión de Materiales</h2>
                        <div>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=material1">Registrar Material</a></li>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=material2">Editar Material</a></li>
                        </div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'contenido3'}">
                    <div class="contenido">
                        <h2>Gestión de Herramientas</h2>
                        <div>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=herramienta1">Registrar Herramienta</a></li>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=herramienta2">Editar Herramienta</a></li>
                        </div>
                    </div>
                </c:when>

                <%-- ACTUALIZADO: MENÚ TRABAJADOR --%>
                <c:when test="${moduloActual eq 'contenido4'}">
                    <div class="contenido">
                        <h2>Gestión de Trabajadores</h2>
                        <div>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=trabajador1">Registrar Trabajador</a></li>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=trabajador2">Lista Trabajadores Autorizados</a></li>
                        </div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'contenido5'}">
                    <div class="contenido">
                        <h2>Gestión de Proveedores</h2>
                        <div>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=proveedor1">Registrar Proveedor</a></li>
                            <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=proveedor2">Editar Proveedor</a></li>
                        </div>
                    </div>
                </c:when>

                <%-- VISTAS DE REACT --%>
                <c:when test="${moduloActual eq 'material1' || moduloActual eq 'material2'}">
                    <div class="registro_mat">
                        <div id="root-gestion-material"></div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'herramienta1' || moduloActual eq 'herramienta2'}">
                    <div class="registro_mat">
                        <div id="root-gestion-herramienta"></div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'proveedor1' || moduloActual eq 'proveedor2'}">
                    <div class="registro_mat">
                        <div id="root-gestion-proveedor"></div>
                    </div>
                </c:when>

                <%-- NUEVO: VISTA REACT TRABAJADOR --%>
                <c:when test="${moduloActual eq 'trabajador1' || moduloActual eq 'trabajador2'}">
                    <div class="registro_mat">
                        <div id="root-gestion-trabajador"></div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'almacen1'}">
                    <div class="registro_mat">
                        <div id="root-lista-material"></div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'almacen2'}">
                    <div class="registro_mat">
                        <div id="root-lista-herramienta"></div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'almacen3'}">
                    <div class="registro_mat">
                        <div id="root-lista-proveedor"></div>
                    </div>
                </c:when>

                <c:otherwise>
                    <div class="contenido">
                        <h1>Bienvenido, ${sessionScope.userName}.</h1>
                        <p>Selecciona una opción para comenzar.</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
    
    <script type="module" src="${pageContext.request.contextPath}/static/react-build/index.js"></script> 
</body>
</html>