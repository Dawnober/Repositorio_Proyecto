package com.web.gestion;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/almacenista/controlador")
public class AlmaControlador extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("isLoggedIn") == null || !(Boolean)session.getAttribute("isLoggedIn")) {
            response.sendRedirect(request.getContextPath() + "/index.jsp"); 
            return;
        }
        
        String view = request.getParameter("view"); 
        String moduloActual = (view == null || view.isEmpty()) ? "inicio" : view;
        
        request.setAttribute("moduloActual", moduloActual); 
        request.getRequestDispatcher("/Almacenista.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String accion = request.getParameter("accion");
        SolicitudInsumoDAO solDAO = new SolicitudInsumoDAO();
        
        if ("aprobarSolicitud".equals(accion)) {
            String idStr = request.getParameter("idSolicitud");
            if (idStr != null) {
                int idSol = Integer.parseInt(idStr);
                // La lógica de restar stock ya ocurre dentro de solDAO.actualizarEstado
                solDAO.actualizarEstado(idSol, "Aprobado");
            }
            response.sendRedirect("controlador?view=solicitudes");

        } else if ("rechazarSolicitud".equals(accion)) {
            String idStr = request.getParameter("idSolicitud");
            if (idStr != null) {
                int idSol = Integer.parseInt(idStr);
                // Simplemente cambiamos el estado sin tocar el stock
                solDAO.actualizarEstado(idSol, "Rechazado");
            }
            response.sendRedirect("controlador?view=solicitudes");

        } else {
            doGet(request, response);
        }
    }
}