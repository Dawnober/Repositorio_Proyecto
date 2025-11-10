package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet API REST para manejar peticiones de registro de Material.
 * Mapeado a la URL /api/materiales.
 */
@WebServlet("/api/materiales") 
public class MaterialApi extends HttpServlet { // Clase principal del Servlet

    private static final long serialVersionUID = 1L;
    private final ObjectMapper objectMapper = new ObjectMapper(); 
    private final MaterialDAO materialDAO = new MaterialDAO(); 

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            Material nuevoMaterial = objectMapper.readValue(request.getInputStream(), Material.class);
            
            boolean exito = materialDAO.guardarMaterial(nuevoMaterial);
            
            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED); 
                objectMapper.writeValue(response.getWriter(), 
                        new RespuestaApi("success", "Material '" + nuevoMaterial.getNombre() + "' registrado correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); 
                objectMapper.writeValue(response.getWriter(), 
                        new RespuestaApi("error", "Error: No se pudo guardar el material en la base de datos."));
            }

        } catch (Exception e) {
            System.err.println("Error interno en MaterialApi: " + e.getMessage());
            e.printStackTrace();
            
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            
            objectMapper.writeValue(response.getWriter(), 
                    new RespuestaApi("error", "Error interno del servidor. Revise los logs."));
        }
    }
    
    /**
     * DTO interno para estructurar la respuesta JSON.
     * Al ser un DTO, se usa 'final' para inmutabilidad, y eliminamos 'private'
     * en la clase para facilitar la vida del compilador y eliminar la advertencia.
     */
    class RespuestaApi { 
        public final String status; 
        public final String message; 
        
        public RespuestaApi(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}