package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@WebServlet("/api/solicitudes")
public class SolicitudInsumoApi extends HttpServlet {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SolicitudInsumoDAO solicitudDAO = new SolicitudInsumoDAO();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json;charset=UTF-8");
        try {
            String email = req.getParameter("email");
            String filtro = req.getParameter("filtro");
            List<SolicitudInsumo> lista;

            if (email != null && !email.isEmpty()) {
                int idTrabajador = solicitudDAO.obtenerIdPorCorreo(email);
                
                if (idTrabajador != -1) {
                    if ("activos".equals(filtro)) {
                        lista = solicitudDAO.listarHerramientasActivasPorTrabajador(idTrabajador);
                    } else {
                        lista = solicitudDAO.listarPorTrabajador(idTrabajador);
                    }
                } else {
                    lista = java.util.Collections.emptyList();
                }
            } else {
                lista = solicitudDAO.listarTodas();
            }
            objectMapper.writeValue(resp.getWriter(), lista);
        } catch (Exception e) {
            resp.setStatus(500);
            objectMapper.writeValue(resp.getWriter(), new Respuesta("error", "Error: " + e.getMessage()));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json;charset=UTF-8");
        
        try {
            String body = req.getReader().lines().collect(Collectors.joining());
            SolicitudInsumo sol = objectMapper.readValue(body, SolicitudInsumo.class);
            
            // Intentar obtener ID desde la sesión si no viene en el cuerpo del JSON
            if (sol.getId_persona() <= 0) {
                HttpSession session = req.getSession(false);
                if (session != null && session.getAttribute("userEmail") != null) {
                    String emailSession = (String) session.getAttribute("userEmail");
                    sol.setId_persona(solicitudDAO.obtenerIdPorCorreo(emailSession));
                }
            }

            if (solicitudDAO.registrarSolicitud(sol)) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                objectMapper.writeValue(resp.getWriter(), new Respuesta("success", "Solicitud registrada con éxito"));
            } else {
                resp.setStatus(400);
                objectMapper.writeValue(resp.getWriter(), new Respuesta("error", "No se pudo registrar"));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            objectMapper.writeValue(resp.getWriter(), new Respuesta("error", e.getMessage()));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json;charset=UTF-8");
        try {
            // Leemos el JSON que envía React/Frontend
            Map<String, Object> data = objectMapper.readValue(req.getReader(), new TypeReference<Map<String, Object>>() {});
            
            // Verificamos que los campos existan en el mapa
            if (data.get("id") == null || data.get("estado") == null) {
                resp.setStatus(400);
                objectMapper.writeValue(resp.getWriter(), new Respuesta("error", "Faltan parámetros: id o estado"));
                return;
            }

            int id = Integer.parseInt(data.get("id").toString());
            String estado = (String) data.get("estado");

            // Llamamos al DAO que maneja la lógica de negocio y stock
            if (solicitudDAO.actualizarEstado(id, estado)) {
                objectMapper.writeValue(resp.getWriter(), new Respuesta("success", "Estado actualizado correctamente"));
            } else {
                resp.setStatus(400);
                objectMapper.writeValue(resp.getWriter(), new Respuesta("error", "No se pudo actualizar el estado"));
            }
        } catch (Exception e) {
            resp.setStatus(500);
            objectMapper.writeValue(resp.getWriter(), new Respuesta("error", "Error interno: " + e.getMessage()));
        }
    }

    // Clase interna para respuestas JSON consistentes
    class Respuesta {
        public String status, message;
        public Respuesta(String s, String m) { this.status = s; this.message = m; }
    }
}