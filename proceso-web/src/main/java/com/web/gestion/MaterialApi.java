package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

@WebServlet("/api/materiales") 
public class MaterialApi extends HttpServlet { 

    private static final long serialVersionUID = 1L;
    private final ObjectMapper objectMapper = new ObjectMapper(); 
    private final MaterialDAO materialDAO = new MaterialDAO(); 

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // NUEVO: Soporte para buscar un solo material por ID (para editar)
            String idStr = request.getParameter("id");
            if (idStr != null && !idStr.isEmpty()) {
                int id = Integer.parseInt(idStr);
                // Filtramos la lista para encontrar el material que React necesita
                Material m = materialDAO.listarMateriales().stream()
                                .filter(mat -> mat.getId() == id)
                                .findFirst()
                                .orElse(null);
                objectMapper.writeValue(response.getWriter(), m);
            } else {
                // Listar todos si no hay ID
                objectMapper.writeValue(response.getWriter(), materialDAO.listarMateriales());
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String jsonBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Material nuevoMaterial = objectMapper.readValue(jsonBody, Material.class);
            
            boolean exito = materialDAO.registrarMaterial(nuevoMaterial);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Material registrado correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo registrar el material."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    // NUEVO MÉTODO: doPut para guardar los cambios al editar
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String jsonBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Material materialActualizado = objectMapper.readValue(jsonBody, Material.class);
            
            // Llamamos al método actualizar que ya tienes en el DAO
            boolean exito = materialDAO.actualizarMaterial(materialActualizado);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Material actualizado correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo actualizar el material."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.trim().isEmpty() || idStr.equals("undefined")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "ID inválido o no proporcionado."));
                return;
            }

            int idEliminar = Integer.parseInt(idStr);
            boolean exito = materialDAO.eliminarMaterial(idEliminar);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Material eliminado correctamente de la BD."));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se encontró el material para eliminar."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }
    
    private void enviarError500(Exception e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); 
        objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "Error interno: " + e.getMessage()));
    }

    class RespuestaApi { 
        public final String status; 
        public final String message; 
        public RespuestaApi(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}