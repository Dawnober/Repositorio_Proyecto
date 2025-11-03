<%-- 
Administrador.jsp - Vista principal del sistema de gestión para el rol Administrador.
     AHORA ACTÚA COMO VISTA dentro del patrón MVC.
     - La lógica de SEGURIDAD, VARIABLES de SESIÓN y NAVEGACIÓN se ha movido a AdminControlador.java.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- 🔑 Incluir la librería JSTL (Core) para usar etiquetas condicionales como <c:choose> --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%-- 

// AHORA (Lógica en Servlet): La seguridad se verifica en AdminControlador.java antes de hacer forward aquí.
--%>

<!DOCTYPE html>
<html lang="es">
<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>YAS CONSTRUCCIONES S.A.S | Área de Administrador</title>

     <%-- 🔑 CORRECCIÓN DE RUTAS ABSOLUTAS (Recursos): Usamos ${pageContext.request.contextPath} para que la ruta siempre inicie desde la raíz del proyecto, sin importar el URL del Servlet. --%>
     <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/Administrador.css">
     <link rel="stylesheet" href="${pageContext.request.contextPath}/css/all.min.css">
</head>
<body>
 
 
     <%-- 🚀 CONTENEDOR BLANCO SUPERIOR: LOGO (IZQUIERDA) Y BOTÓN (DERECHA) --%>
     <div class="top-spacer">
         <div class="logo-superior">
             <%-- 🔑 CORRECCIÓN DE RUTAS (Imagen): Ruta absoluta para la imagen --%>
             <img src="${pageContext.request.contextPath}/img/empresa2.png" alt="Logo YAS CONSTRUCCIONES S.A.S" class="img_empresa">
         </div>

         <%-- Botón de Cerrar Sesión (ARRIBA A LA DERECHA) --%>
         <%-- (Form Action): Se usa Context Path para evitar el error 404 al salir. --%>
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
                 <%-- DINÁMICO: Rol. Usamos EL (Expression Language) para acceder a los atributos de sesión/request --%>
                 <h3>${sessionScope.userRolDisplay}</h3> 
                 <%-- DINÁMICO: Nombre COMPLETO --%>
                 <h3 class="nombre_persona">${sessionScope.userName}</h3>
             </ul>
         </div>
     </div>

     <div class="main-layout">
 
     
         <nav class="nav-sidebar">
             <%-- LISTA LATERAL IZQUIERDO: Ahora todos los links apuntan al Controlador --%>
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
 
         
             <%-- Módulo Principal: Almacén --%>
                 <c:when test="${requestScope.moduloActual eq 'contenido1'}">
                 <div id="contenido1" class="contenido">
                         <h2>¿Qué quieres ver?</h2>
                         <div>
                             <%-- Los sub-enlaces también deben usar el Controlador --%>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen1">Material</a></li>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=almacen2">Herramienta</a></li>
                         </div>
                     </div>
                 </c:when>

                 <%-- Módulo Principal: Material --%>
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

                 <%-- Módulo Principal: Herramienta --%>
                 <c:when test="${requestScope.moduloActual eq 'contenido3'}">
                 <div id="contenido3" class="contenido">
               
                      <h2>¿Qué quieres hacer?</h2>
                         <div>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=herramienta1">Registrar Herramienta</a></li>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=herramienta2">Editar Herramienta</a></li>
                         </div>
                     </div>
                 </c:when>

                 <%-- Módulo Principal: Trabajador Autorizado --%>
                 <c:when test="${requestScope.moduloActual eq 'contenido4'}">
                 <div id="contenido4" class="contenido">
                         <h2>¿Qué quieres hacer?</h2>
                         <div>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=trabajador1">Registrar Trabajador</a></li>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=trabajador2">Editar Trabajador</a></li>
                         </div>
                     </div>
                 </c:when>

                 <%-- Módulo Principal: Proveedor --%>
                 <c:when test="${requestScope.moduloActual eq 'contenido5'}">
                 <div id="contenido5" class="contenido">
                         <h2>¿Qué quieres hacer?</h2>
                         <div>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=proveedor1">Registar Proveedor</a></li>
                             <%-- (Sub-navegación) --%>
                             <li class="boton2"><a href="${pageContext.request.contextPath}/administrador/controlador?view=proveedor2">Editar Proveedor</a></li>
                         </div>
                     </div>
                 </c:when>
 
             
                 <%-- ------------------------------------------------------------- --%>
                 <%-- Módulos de CONTENIDO FINAL (Inventarios y Formularios) --%>
                 <%-- ------------------------------------------------------------- --%>

                 <%-- Inventario de Materiales (Almacen) --%>
                 <c:when test="${requestScope.moduloActual eq 'almacen1'}">
                 <div id="almacen1" class="lista_material">
                         <h2>Inventario de Materiales</h2>
                         <%-- Aquí se usaría <c:forEach> para iterar sobre la lista de materiales traída por el Servlet --%>
                         <div>
                             <h3 class="text1">M-1 Cemento</h3>
                             <%-- 🔑 CORRECCIÓN DE RUTAS (Imagen): Ruta absoluta para la imagen --%>
                             <img src="${pageContext.request.contextPath}/img/cemento.png" alt="Imagen de Cemento" class="img_cemento">
                             <h3 class="text11">800 bultos</h3>
                         </div>
 
                     
                         <div>
                             <h3 class="text2">M-2 Ladrillo</h3>
                             <%-- 🔑 CORRECCIÓN DE RUTAS (Imagen): Ruta absoluta para la imagen --%>
                             <img src="${pageContext.request.contextPath}/img/ladrillo.png" alt="Imagen de Ladrillo" class="img_ladrillo">
                             <h3 class="text22">2000 ladrillos</h3>
                         </div>
 
                     
                         <%-- ... Otros materiales ... --%>
                     </div>
                 </c:when>

                 <%-- Inventario de Herramientas (Almacen) --%>
                 <c:when test="${requestScope.moduloActual eq 'almacen2'}">
                 <div id="almacen2" class="lista_herramienta">
                         <h2>Inventario de Herramientas</h2>
                         <%-- Aquí se usaría <c:forEach> para iterar sobre la lista de herramientas traída por el Servlet --%>
                         <div>
                             <h3 class="text5">H-1 Pulidora</h3>
                             <%-- 🔑 CORRECCIÓN DE RUTAS (Imagen): Ruta absoluta para la imagen --%>
                             <img src="${pageContext.request.contextPath}/img/pulidora.png" alt="Imagen de Pulidora" class="img_pulidora">
                             <h3 class="text55">10 Pulidoras</h3>
                         </div>
 
                     
                         <%-- ... Otras herramientas ... --%>
                     </div>
                 </c:when>

                 <%-- Módulo de Registro de Material (material1) --%>
                 <c:when test="${requestScope.moduloActual eq 'material1'}">
                 <div id="material1" class="registro_mat">
                         <h2>Formulario de Registro de Material</h2>
                         <%-- Esto se puede incluir de un JSP separado para mantener este archivo limpio: --%>
                         <%-- <jsp:include page="/modulos/registroMaterial.jsp" /> --%>
                         <p>Aquí irá el formulario para el registro de materiales.</p>
                     </div>
                 </c:when>
 
             
                 <%-- ... Continúa con los <c:when> para todos los otros contenidos (material2, herramienta1, etc.) ... --%>

                 <c:otherwise>
                 <%-- Mensaje por defecto si la variable no está definida --%>
                     <h1>Bienvenido, ${sessionScope.userName}. Selecciona una opción del menú.</h1>
                 </c:otherwise>
             </c:choose>
 
         
             <%-- 🔑 NOTA: La lógica para el formulario vacío y la acción absoluta se manejarán mejor en un Servlet POST --%>
             <%--
             <form action="${pageContext.request.contextPath}/api/materiales/registrar" method="POST" autocomplete="off">
                 <div id=""> ... </div>
             </form>
             --%>
         </div>
     </div>
</body>
</html>