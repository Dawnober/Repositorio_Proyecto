// Este código asume un entorno de servidor web Java 21 / Jakarta EE (ej: Tomcat 10+)
// y que el driver JDBC para MySQL y la librería JBCrypt están en el classpath (vía pom.xml).
package com.web.gestion;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
// 🚀 IMPORTACIONES DE JAKARTA EE
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession; 
// 🔒 IMPORTACIÓN DE JBCRYPT
import org.mindrot.jbcrypt.BCrypt; 

/**
 * Servlet que procesa el formulario de inicio de sesión de index.jsp.
 */
@WebServlet(name = "LoginProcesador", urlPatterns = {"/LoginProcesador"})
public class LoginProcesador extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // --- Configuración JDBC ---
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/proyecto";
    private static final String DB_USER = "root";
    private static final String DB_PASS = ""; 
    
    // 🔑 CONSTANTES DE ROLES
    public static final String ROL_ADMINISTRADOR = "administrador";
    public static final String ROL_ALMACENISTA = "almacenista";
    public static final String ROL_AUTORIZADO = "trabajador_autorizado";

    /**
     * Maneja las peticiones POST (Envío del formulario de login).
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener los parámetros del formulario
        String rol = request.getParameter("rol");
        String correo = request.getParameter("correo");
        String password = request.getParameter("password"); // Valor crudo

        // --- LÓGICA DE LIMPIEZA ---
        // Solo conservamos la versión limpia de la contraseña
        String cleanPassword = (password != null) ? password.trim() : "";
        
        // --- INICIO DEL PROCESO DE LOGIN ---
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {

                // 2. Validar campos requeridos
                if (rol == null || correo == null || cleanPassword.isEmpty() || rol.isEmpty() || correo.isEmpty()) {
                    System.out.println("DEBUG: Campos incompletos.");
                    request.setAttribute("mensaje", "Error: Faltan datos para el inicio de sesión.");
                    request.getRequestDispatcher("index.jsp").forward(request, response);
                    return; 
                }

                // 3. Consulta: Selecciona nombres, apellidos y el hash
                String sql = "SELECT nombres, apellidos, password_hash FROM persona WHERE correo = ? AND rol = ?";
                
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, correo);
                    stmt.setString(2, rol);

                    // 4. Ejecución de la consulta y procesamiento del ResultSet
                    try (ResultSet rs = stmt.executeQuery()) {
                        
                        // Solo una llamada a rs.next()
                        if (rs.next()) {
                            // DEBUG 1: Usuario encontrado
                            System.out.println("DEBUG: Usuario encontrado en la DB para rol: " + rol); 
                            
                            // 🚀 Obtener nombres y apellidos
                            String nombres = rs.getString("nombres");
                            String apellidos = rs.getString("apellidos");
                            String storedHash = rs.getString("password_hash"); 
                            
                            // 5. Verificación de Contraseña con BCrypt
                            if (BCrypt.checkpw(cleanPassword, storedHash)) { 
                                
                                // DEBUG 2: Contraseña correcta
                                System.out.println("DEBUG: Contraseña correcta. Preparando redirección."); 
                                
                                // Concatenar Nombres y Apellidos
                                String nombreCompleto = nombres;
                                if (apellidos != null && !apellidos.trim().isEmpty()) {
                                    nombreCompleto += " " + apellidos;
                                }

                                // ✅ LOGIN EXITOSO
                                HttpSession session = request.getSession(true);
                                session.setAttribute("isLoggedIn", true);
                                session.setAttribute("userRol", rol); // Rol interno (ej: "administrador")
                                
                                // Crear el Rol de DISPLAY para mostrar en el JSP
                                String rolDisplay = "Usuario"; // Valor por defecto
                                if (rol.equals(ROL_ADMINISTRADOR)) {
                                    rolDisplay = "Administrador";
                                } else if (rol.equals(ROL_ALMACENISTA)) {
                                    rolDisplay = "Almacenista";
                                } else if (rol.equals(ROL_AUTORIZADO)) {
                                    rolDisplay = "Trabajador Autorizado";
                                }
                                
                                session.setAttribute("userRolDisplay", rolDisplay);
                                
                                // 🚀 Guardar el nombre completo
                                session.setAttribute("userName", nombreCompleto);

                                // 6. Lógica de redirección basada en el rol
                                String redirectURL = "";
                                
                                // Usar el controlador para que cargue la vista por defecto
                                if (rol.equals(ROL_ADMINISTRADOR)) { 
                                    // Redirigir al controlador para que se encargue de cargar la vista de administrador
                                    redirectURL = request.getContextPath() + "/administrador/controlador"; 
                                } else if (rol.equals(ROL_ALMACENISTA) || rol.equals(ROL_AUTORIZADO)) {
                                    // Aquí se puede poner el controlador para el Almacenista
                                    redirectURL = ""; 
                                } else {
                                    redirectURL = request.getContextPath() + "/index.jsp"; 
                                }
                                
                                // 🚀 USAR REDIRECT
                                response.sendRedirect(redirectURL);
                                return; // Detener la ejecución
                                
                            } else {
                                // DEBUG 3: Contraseña incorrecta
                                System.out.println("DEBUG: Fallo de BCrypt. checkpw devolvió false."); 
                                
                                // 7. Contraseña incorrecta
                                request.setAttribute("mensaje", 
                                    "Error: Contraseña incorrecta. Intente de nuevo.");
                                
                                // 🔑 Reenviar a index.jsp y retornar
                                request.getRequestDispatcher("index.jsp").forward(request, response);
                                return; 
                            }
                        } else {
                            // DEBUG 4: Usuario NO encontrado
                            System.out.println("DEBUG: Usuario NO encontrado en la DB para correo: " + correo + " y rol: " + rol); 
                            
                            // 8. Usuario o rol no encontrado en la DB
                            request.setAttribute("mensaje", "Error: Usuario o Rol no encontrado en la base de datos.");
                            
                            // 🔑 Reenviar a index.jsp y retornar
                            request.getRequestDispatcher("index.jsp").forward(request, response);
                            return; 
                        }
                    } 
                } 
            } catch (SQLException e) {
                log("Error de SQL en LoginProcesador: " + e.getMessage(), e);
                request.setAttribute("mensaje", "Error interno del servidor (Problema de Base de Datos).");
                request.getRequestDispatcher("index.jsp").forward(request, response);
            }
        } catch (ClassNotFoundException e) {
            log("Error: Driver JDBC no encontrado.", e);
            request.setAttribute("mensaje", "Error interno del servidor: Falta el driver MySQL.");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        } catch (Exception e) {
             // Manejo de otros errores que no son SQL ni Driver
             log("Error desconocido en LoginProcesador.", e);
             request.setAttribute("mensaje", "Error inesperado durante el proceso de login. Revise los logs.");
             response.setContentType("text/html");
             request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }
    
    /**
     * Maneja las peticiones GET (Acceso directo al Servlet).
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setAttribute("mensaje", "Información: El formulario debe ser enviado usando POST.");
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }
}