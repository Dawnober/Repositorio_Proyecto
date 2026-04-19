package com.web.gestion;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/trabajador/controlador")
public class TrabControlador extends HttpServlet {
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

        if (view == null || view.isEmpty()) {
            moduloActual = "default";
        } 
        else if (view.equals("solicitar") || view.equals("mis-pedidos") || view.equals("herramientas") || view.equals("historial")) {
            moduloActual = view;
        }
        else {
            moduloActual = "default";
        }
        
        request.setAttribute("moduloActual", moduloActual); 
        
        RequestDispatcher dispatcher = request.getRequestDispatcher("/Trabajador.jsp");
        dispatcher.forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}