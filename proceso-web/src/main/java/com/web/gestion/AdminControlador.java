package com.web.gestion;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

// Se mapea el controlador a la URL principal que carga el dashboard
@WebServlet("/administrador/controlador")
public class AdminControlador extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {

		// --- 1. GESTIÓN DE SEGURIDAD ---
		HttpSession session = request.getSession(false);
		// Si la sesión es nula o no está logueado, redirigir al inicio.
		if (session == null || session.getAttribute("isLoggedIn") == null || 
			!(Boolean)session.getAttribute("isLoggedIn")) {
			// Se usa getContextPath() para asegurar la ruta correcta de redirección
			response.sendRedirect(request.getContextPath() + "/index.jsp"); 
			return;
		}
		
		// --- 2. DETERMINAR EL MÓDULO (Vista) A CARGAR ---
		// El parámetro 'view' viene de los enlaces del menú lateral.
		String moduloActual = request.getParameter("view"); 
		
		// Si no se especifica 'view' (ej. la primera vez que entran), carga el contenido por defecto ('contenido1' o 'bienvenida')
		// Esto asegura que el contenido de Almacén/Bienvenida cargue inmediatamente al inicio.
		if (moduloActual == null || moduloActual.isEmpty()) {
			moduloActual = "contenido1"; 
		}
		
		// --- 3. LÓGICA DE NEGOCIO Y PREPARACIÓN DE DATOS ---
		// **Ejemplo de Lógica: Si el usuario quiere ver el Inventario de Materiales**
		if (moduloActual.equals("almacen1")) { 
			
			// 🚨 Aquí iria la LÓGICA para obtener los datos de la base de datos (BD) 🚨
			// EJEMPLO: Obtener una lista de materiales de tu capa DAO/Service.
			// List<Material> materiales = MaterialService.obtenerInventario();
			// request.setAttribute("inventarioMateriales", materiales);
		} 
		
		// **Aqui se puede replicar el 'else if' para cada módulo que requiera datos de la BD**
		/*
		else if (moduloActual.equals("almacen2")) { // Inventario de Herramientas
			// Lógica para obtener las herramientas...
		}
		*/

		// --- 4. PREPARAR EL REENVÍO (FORWARD) ---
		// Almacenar el nombre del módulo en el Request para que el JSP sepa qué mostrar.
		request.setAttribute("moduloActual", moduloActual); 
		
		// Reenviar el control a la página JSP para la renderización final.
		RequestDispatcher dispatcher = request.getRequestDispatcher("/Administrador.jsp");
		dispatcher.forward(request, response);
	}
	
	// El método doPost se dejaría para procesar formularios (ej. registro de material)
	// Pero para la navegación del menú (GET) solo se necesita el doGet.
}