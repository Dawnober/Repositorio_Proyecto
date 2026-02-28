package com.web.gestion;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/administrador/controlador")
public class AdminControlador extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isLoggedIn") == null || 
            !(Boolean)session.getAttribute("isLoggedIn")) {
            response.sendRedirect(request.getContextPath() + "/index.jsp"); 
            return;
        }
        
        String view = request.getParameter("view"); 
        String moduloActual; 

        if (view == null || view.isEmpty() || view.equals("contenido1")) {
            moduloActual = "contenido1";
        } 
        else if (view.equals("contenido2")) {
            moduloActual = "contenido2";
        } 
        else if (view.equals("contenido3")) {
            moduloActual = "contenido3";
        } 
        else if (view.equals("contenido4")) {
            moduloActual = "contenido4"; // Menú central de Trabajador
        }
        else if (view.equals("contenido5")) {
            moduloActual = "contenido5"; // Gestión Proveedor
        }
        else if (view.equals("almacen1") || view.equals("almacen2") || view.equals("almacen3")) {
            moduloActual = view;
        }
        else if (view.startsWith("material") || view.startsWith("herramienta") || 
                 view.startsWith("proveedor") || view.startsWith("trabajador")) { // <--- Añadido trabajador
            moduloActual = view;
        }
        else {
            moduloActual = "default";
        }
        
        request.setAttribute("moduloActual", moduloActual); 
        RequestDispatcher dispatcher = request.getRequestDispatcher("/Administrador.jsp");
        dispatcher.forward(request, response);
    }
}