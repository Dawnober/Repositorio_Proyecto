<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YAS CONSTRUCCIONES S.A.S</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght400;700&display=swap" rel="stylesheet">
    
    <style>
        /* ------------------------------------------- */
        /* CSS INTEGRADO */
        /* ------------------------------------------- */
        
        /* Variables */
        :root {
            --color-principal: #c28200;
            --color-fondo: #e9ecef; /* Gris claro */
            --color-texto: #333;
            --color-borde: #ccc;
        }

        .logo {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 200px;
            height: auto;
            z-index: 10;
        }

        /* Estilos Globales y Centrado */
        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--color-fondo);
            color: var(--color-texto);
            margin: 0;
            display: flex; 
            justify-content: center; /* Centra el formulario */
            align-items: center;
            min-height: 100vh;
            position: relative; 
            z-index: 1;
        }

        /* pseudo-elementos para la imagen de fondo de la mitad derecha */
        body::after {
            content: ""; 
            position: absolute;
            top: 0;
            right: 0; 
            
            /* TAMAÑO: Cubre exactamente la mitad derecha de la vista (viewport) */
            width: 50vw; 
            height: 100vh; 
            
            /* IMAGEN Y CONFIGURACIÓN */
            background-image: url('img/Fondo_Formulario.jpeg');
            background-size: cover; 
            background-repeat: no-repeat;
            background-position: center;
        
            /* Definir la Máscara de Gradiente para el Desvanecimiento */
            mask-image: linear-gradient(
                to left, 
                rgba(0, 0, 0, 1) 80%, 
                rgba(0, 0, 0, 0) 100% 
            );
            -webkit-mask-image: linear-gradient( 
                to left,
                rgba(0, 0, 0, 1) 80%, 
                rgba(0, 0, 0, 0) 100%
            );
            opacity: 0.25; 
            z-index: -1; 
        }


        /* Contenedor del Formulario de Login */
        .login-form {
            background: white;
            padding: 30px 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            max-width: 400px; 
            width: 100%;
            text-align: center;
            border-top: 5px solid var(--color-principal); 
        }

        .login-form h2 {
            color: var(--color-principal);
            margin-bottom: 5px;
            font-size:30px;
        }

        .login-form p {
            margin-bottom: 25px;
            color: #666;
            font-size:17px;
        }

        /* Estilos de Grupos y Etiquetas */
        .form-group {
            text-align: left;
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 6px;
            font-weight: 700;
            font-size: 16px;
            color: var(--color-texto);
        }

        /* Estilos de Campos de TEXTO y PASSWORD (Estándar) */
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--color-borde);
            border-radius: 6px;
            box-sizing: border-box; 
            font-size: 16px; 
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        /* Estilos SÓLO para el campo SELECT (Desplegable personalizado) */
        select { 
            width: 100%;
            padding: 12px;
            border: 1px solid var(--color-borde);
            border-radius: 6px;
            box-sizing: border-box; 
            font-size: 16px; 
            color: var(--color-texto); 
            transition: border-color 0.3s, box-shadow 0.3s;
            -webkit-appearance: none; 
            -moz-appearance: none;
            appearance: none; 
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c28200%22%20d%3D%22M287%2069.9L146.4%20210.6%205.8%2069.9z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: right 10px top 50%;
            background-size: 12px auto;
            padding-right: 30px; 
        }

        /* Este bloque de código define los estilos que se aplicarán a los elementos
          de formulario cuando el usuario los selecciona activamente. */
        input:focus, 
        select:focus { 
            /* El selector ':focus' asegura que estos estilos SÓLO se apliquen
                cuando el elemento (input o select) tiene el foco. */

            /* Definir el color del borde al enfocar */
            border-color: var(--color-principal); 
            /* Añadir un anillo de enfoque personalizado (Focus Ring) */
            box-shadow: 0 0 0 3px rgba(194, 130, 0, 0.4); 
            /* Eliminar el contorno predeterminado del navegador */
            outline: none;
        }

        /* Estilo para el placeholder (Opción deshabilitada) */
        select:required:invalid {
            color: #6c757d; 
        }

        /* Opciones, Botón */
        .opciones {
            text-align: right;
            margin-bottom: 25px;
        }

        .olvido-pass {
            color: var(--color-principal);
            text-decoration: none;
            font-size: 16px;
            transition: color 0.2s;
        }

        .olvido-pass:hover {
            color: #a06e00;
            text-decoration: underline;
        }

        button[type="submit"] {
            background-color: var(--color-principal);
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 700;
            width: 100%;
            margin-bottom: 20px;
            transition: background-color 0.2s, transform 0.1s;
        }

        button[type="submit"]:hover {
            background-color: #a06e00;
            transform: translateY(-1px);
        }

        button[type="submit"]:active {
            transform: translateY(0);
        }
        
        /* 🔑 POSICIONAMIENTO FIJO Y VISIBLE (CORRECCIÓN FINAL) */
        .message-container {
            position: fixed; 
            width: 300px; /* Ancho deseado */
            z-index: 100; 

            /* 🔑 CLAVE DE POSICIONAMIENTO HORIZONTAL (Ajuste manual para visibilidad) */
            /* Coloca el mensaje en left: 5px del borde de la pantalla (visible) */
            left: 50px; 
            
            /* 🔑 CLAVE DE POSICIONAMIENTO VERTICAL (Fijo debajo del logo) */
            top: 300px; 
            
            /* Eliminamos 'transform' para que no mueva el mensaje fuera de la vista. */
        }
        
        /* Mensajes JSP (feedback del servidor) */
        .message {
            display: block; 
            width: 100%; 
            padding: 15px;
            border-radius: 8px;
            font-weight: 700;
            text-align: center;
            margin: 0; 
        }
        .success { background-color: #d8ead8; color: #38761d; border: 1px solid #70a75d; }
        .error { background-color: #f7d7da; color: #721c24; border: 1px solid #e76c76; } 
    </style>
</head>
<body>

    <img src="img/empresa2.png" alt="Logo de la Empresa YAS CONSTRUCCIONES" class="logo">
    
    
    <%-- 🔑 BLOQUE JSP DEL MENSAJE: Usa position: fixed; para fijarse a la izquierda. --%>
    <% 
        // Recupera el mensaje que pudo haber sido enviado por el LoginProcesador después de un intento de login
        String mensaje = (String) request.getAttribute("mensaje");
        if (mensaje != null) {
            // Determina la clase CSS (success o error) basada en el contenido del mensaje
            String cssClass = mensaje.contains("Éxito") ? "success" : "error";
    %>
        <div class="message-container">
            <div class="message <%= cssClass %>"><%= mensaje %></div>
        </div>
    <%
        }
    %>
    <%-- FIN DEL BLOQUE DE MENSAJE --%>

    
    <form class="login-form" action="LoginProcesador" method="POST">
        
        <h2>Iniciar Sesión</h2>
        <p>Completa el formulario para poder ingresar. </p>

        <div class="form-group">
            <label for="rol">Selecciona quien eres</label>
            <select id="rol" name="rol" required>
                <option value="" disabled selected>Quien eres?</option>
                <option value="administrador">Administrador</option>
                <option value="almacenista">Almacenista</option>
                <option value="trabajador_autorizado">Trabajador Autorizado</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input 
                type="text" 
                id="email" 
                name="correo" 
                placeholder="ejemplo@sena.com" 
                required 
                autocomplete="username"
            >
        </div>
        
        <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Ingresa tu contraseña" 
                required 
                autocomplete="current-password"
            >
        </div>
        
        <div class="opciones">
            <a href="#" class="olvido-pass">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit">Ingresar</button>
    </form>
    
</body>
</html>