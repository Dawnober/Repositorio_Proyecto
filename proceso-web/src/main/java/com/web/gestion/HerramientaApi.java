package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

@WebServlet("/api/herramientas")
public class HerramientaApi extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HerramientaDAO herramientaDAO = new HerramientaDAO();

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
            String idStr = request.getParameter("id");
            if (idStr != null && !idStr.isEmpty()) {
                int id = Integer.parseInt(idStr);
                Herramienta h = herramientaDAO.listarHerramientas().stream()
                                .filter(herr -> herr.getId() == id)
                                .findFirst()
                                .orElse(null);
                objectMapper.writeValue(response.getWriter(), h);
            } else {
                objectMapper.writeValue(response.getWriter(), herramientaDAO.listarHerramientas());
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
            Herramienta nuevaHerramienta = objectMapper.readValue(jsonBody, Herramienta.class);
            boolean exito = herramientaDAO.registrarHerramienta(nuevaHerramienta);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Herramienta registrada correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo registrar la herramienta."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String jsonBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Herramienta herramientaActualizada = objectMapper.readValue(jsonBody, Herramienta.class);
            boolean exito = herramientaDAO.actualizarHerramienta(herramientaActualizada);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Herramienta actualizada correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo actualizar la herramienta."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String idStr = request.getParameter("id");
            if (idStr == null || idStr.trim().isEmpty() || idStr.equals("undefined")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "ID de herramienta inválido."));
                return;
            }

            int idEliminar = Integer.parseInt(idStr);
            boolean exito = herramientaDAO.eliminarHerramienta(idEliminar);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Herramienta eliminada correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se encontró la herramienta."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    private void enviarError500(Exception e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); 
        objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "Error interno en Herramientas: " + e.getMessage()));
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