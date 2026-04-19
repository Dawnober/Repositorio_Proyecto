<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YAS CONSTRUCCIONES S.A.S | Área de Trabajador</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/Estilos.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/react-build/index.css">
</head>
<body>
    <script>
        window.userEmail = "${sessionScope.userEmail}"; 
        window.userId = "${sessionScope.userId}"; 
    </script>

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
                <li class="botones ${moduloActual eq 'solicitar' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/trabajador/controlador?view=solicitar">
                        <i class="fa-solid fa-file-signature"></i> Solicitar Insumos
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'mis-pedidos' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/trabajador/controlador?view=mis-pedidos">
                        <i class="fa-solid fa-clock-rotate-left"></i> Mis Pedidos
                    </a>
                </li>
                <li class="botones ${moduloActual eq 'herramientas' ? 'activo' : ''}">
                    <a href="${pageContext.request.contextPath}/trabajador/controlador?view=herramientas">
                        <i class="fa-solid fa-toolbox"></i> Mis Herramientas
                    </a>
                </li>
            </ul>
        </nav>

        <div class="main-content-area">
            <c:choose>
                <c:when test="${moduloActual eq 'solicitar'}">
                    <div id="root-solicitar-insumos"></div>
                </c:when>
                <c:when test="${moduloActual eq 'mis-pedidos'}">
                    <div id="root-mis-pedidos"></div>
                </c:when>
                <c:when test="${moduloActual eq 'herramientas'}">
                    <div id="root-mis-herramientas"></div>
                </c:when>
                <c:otherwise>
                    <div class="contenido">
                        <h1>Bienvenido, ${sessionScope.userName}.</h1>
                        <p>Seleccione una opción del menú para gestionar sus requerimientos de obra.</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
    
    <script type="module" src="${pageContext.request.contextPath}/static/react-build/index.js"></script> 
</body>
</html>