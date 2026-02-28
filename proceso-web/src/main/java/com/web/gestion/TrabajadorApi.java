package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/trabajadores")
public class TrabajadorApi extends HttpServlet {
    
    private final TrabajadorDAO dao = new TrabajadorDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    // GET: Listar todos los trabajadores
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            List<Trabajador> lista = dao.listarTrabajadores();
            response.getWriter().write(mapper.writeValueAsString(lista));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\": \"No se pudo obtener la lista\"}");
        }
    }

    // POST: Registrar nuevo trabajador
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            Trabajador t = mapper.readValue(request.getInputStream(), Trabajador.class);
            boolean exito = dao.registrarTrabajador(t);
            
            Map<String, String> respuesta = new HashMap<>();
            if (exito) {
                respuesta.put("message", "Trabajador registrado y autorizado correctamente");
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                respuesta.put("message", "Error al registrar en la base de datos");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            response.getWriter().write(mapper.writeValueAsString(respuesta));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\": \"Error al procesar los datos JSON\"}");
        }
    }

    // PUT: Actualizar trabajador existente
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            Trabajador t = mapper.readValue(request.getInputStream(), Trabajador.class);
            boolean exito = dao.actualizarTrabajador(t); // Necesitas crear este método en el DAO
            
            Map<String, String> respuesta = new HashMap<>();
            if (exito) {
                respuesta.put("message", "Trabajador actualizado correctamente");
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                respuesta.put("message", "Error al actualizar en la base de datos");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            response.getWriter().write(mapper.writeValueAsString(respuesta));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\": \"Error al procesar los datos para actualizar\"}");
        }
    }

    // DELETE: Eliminar trabajador
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String idParam = request.getParameter("id");
        Map<String, String> respuesta = new HashMap<>();

        if (idParam != null) {
            try {
                int id = Integer.parseInt(idParam);
                boolean exito = dao.eliminarTrabajador(id); // Necesitas crear este método en el DAO
                
                if (exito) {
                    respuesta.put("message", "Trabajador eliminado correctamente");
                    response.setStatus(HttpServletResponse.SC_OK);
                } else {
                    respuesta.put("message", "No se pudo eliminar el trabajador");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                respuesta.put("message", "ID inválido");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            respuesta.put("message", "Falta el parámetro ID");
        }
        response.getWriter().write(mapper.writeValueAsString(respuesta));
    }
}