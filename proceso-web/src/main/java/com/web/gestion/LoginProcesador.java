package com.web.gestion;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession; 
import org.mindrot.jbcrypt.BCrypt; 

@WebServlet(name = "LoginProcesador", urlPatterns = {"/LoginProcesador"})
public class LoginProcesador extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/proyecto";
    private static final String DB_USER = "root";
    private static final String DB_PASS = ""; 
    
    public static final String ROL_ADMINISTRADOR = "administrador";
    public static final String ROL_ALMACENISTA = "almacenista";
    public static final String ROL_AUTORIZADO = "trabajador_autorizado";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String rol = request.getParameter("rol");
        String correo = request.getParameter("correo");
        String password = request.getParameter("password"); 
        String cleanPassword = (password != null) ? password.trim() : "";
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {

                if (rol == null || correo == null || cleanPassword.isEmpty()) {
                    request.setAttribute("mensaje", "Error: Faltan datos.");
                    request.getRequestDispatcher("index.jsp").forward(request, response);
                    return; 
                }

                // id_persona en el SELECT
                String sql = "SELECT id_persona, nombres, apellidos, password_hash FROM persona WHERE correo = ? AND rol = ?";
                
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, correo);
                    stmt.setString(2, rol);

                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            String storedHash = rs.getString("password_hash"); 
                            
                            if (BCrypt.checkpw(cleanPassword, storedHash)) { 
                                // Se Extrae el ID numérico
                                int idPersona = rs.getInt("id_persona");
                                String nombreCompleto = rs.getString("nombres") + " " + rs.getString("apellidos");
                                HttpSession session = request.getSession(true);
                                
                                // --- DATOS DE SESIÓN ---
                                session.setAttribute("isLoggedIn", true);
                                session.setAttribute("userId", idPersona); // ✅ Guardamos el ID para React
                                session.setAttribute("userRol", rol);
                                session.setAttribute("userName", nombreCompleto);
                                session.setAttribute("userEmail", correo);

                                String rolDisplay = "Usuario";
                                if (rol.equals(ROL_ADMINISTRADOR)) rolDisplay = "Administrador";
                                else if (rol.equals(ROL_ALMACENISTA)) rolDisplay = "Almacenista";
                                else if (rol.equals(ROL_AUTORIZADO)) rolDisplay = "Trabajador Autorizado";
                                session.setAttribute("userRolDisplay", rolDisplay);

                                String redirectURL = request.getContextPath() + (
                                    rol.equals(ROL_ADMINISTRADOR) ? "/Administrador.jsp" :
                                    rol.equals(ROL_ALMACENISTA) ? "/Almacenista.jsp" :
                                    rol.equals(ROL_AUTORIZADO) ? "/Trabajador.jsp" : "/index.jsp"
                                );
                                
                                response.sendRedirect(redirectURL);
                                return; 
                            } else {
                                request.setAttribute("mensaje", "Error: Contraseña incorrecta.");
                                request.getRequestDispatcher("index.jsp").forward(request, response);
                            }
                        } else {
                            request.setAttribute("mensaje", "Error: Usuario o Rol no encontrado.");
                            request.getRequestDispatcher("index.jsp").forward(request, response);
                        }
                    } 
                } 
            } 
        } catch (Exception e) {
             log("Error en LoginProcesador", e);
             request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendRedirect("index.jsp");
    }
}