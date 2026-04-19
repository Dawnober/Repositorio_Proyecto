<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YAS CONSTRUCCIONES S.A.S | Área de Almacenista</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/Estilos.css">
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
                <li class="botones ${moduloActual eq 'almacen1' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/almacenista/controlador?view=almacen1">
                        <i class="fa-solid fa-boxes-stacked"></i> Materiales
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'almacen2' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/almacenista/controlador?view=almacen2">
                        <i class="fa-solid fa-wrench"></i> Herramientas
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'pedidos' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/almacenista/controlador?view=pedidos">
                        <i class="fa-solid fa-truck-ramp-box"></i> Pedidos
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'solicitudes' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/almacenista/controlador?view=solicitudes">
                        <i class="fa-solid fa-clipboard-list"></i> Solicitudes
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'prestamos' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/almacenista/controlador?view=prestamos">
                        <i class="fa-solid fa-hand-holding-hand"></i> Préstamos
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'danos' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/almacenista/controlador?view=danos">
                        <i class="fa-solid fa-triangle-exclamation"></i> Daños
                    </a>
                </li>
            </ul>
        </nav>

        <div class="main-content-area" style="background-color: #ffffff; min-height: 85vh; padding: 20px; width: 100%;">
            <c:choose>
                <c:when test="${moduloActual eq 'almacen1'}">
                    <div class="contenedor-limpio"><div id="root-lista-material"></div></div>
                </c:when>

                <c:when test="${moduloActual eq 'almacen2'}">
                    <div class="contenedor-limpio"><div id="root-lista-herramienta"></div></div>
                </c:when>

                <c:when test="${moduloActual eq 'pedidos'}">
                    <div class="registro_mat"><div id="root-recepcion-pedido"></div></div>
                </c:when>
                
                <c:when test="${moduloActual eq 'solicitudes'}">
                    <div style="display: flex; justify-content: center; width: 100%; background-color: #ffffff;">
                        <div id="root-atender-solicitudes" style="width: 100%;"></div>
                    </div>
                </c:when>

                <c:when test="${moduloActual eq 'prestamos'}">
                    <div style="width: 100%; background-color: #ffffff;">
                        <div id="root-control-prestamos"></div>
                    </div>
                </c:when>
                
                <c:when test="${moduloActual eq 'danos'}">
                    <div style="width: 100%; background-color: #ffffff;">
                        <div id="root-gestion-danos"></div>
                    </div>
                </c:when>

                <c:otherwise>
                    <div class="contenido">
                        <h1>Bienvenido, ${sessionScope.userName}.</h1>
                        <p>Gestione el inventario y las solicitudes pendientes desde el menú lateral.</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
    
    <script type="module" src="${pageContext.request.contextPath}/static/react-build/index.js"></script> 
</body>
</html>