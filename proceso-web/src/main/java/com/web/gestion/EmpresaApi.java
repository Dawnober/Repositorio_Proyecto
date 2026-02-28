package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

@WebServlet("/api/proveedores")
public class EmpresaApi extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final EmpresaDAO empresaDAO = new EmpresaDAO();

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
                Empresa e = empresaDAO.listar().stream()
                                .filter(emp -> emp.getId() == id)
                                .findFirst()
                                .orElse(null);
                objectMapper.writeValue(response.getWriter(), e);
            } else {
                objectMapper.writeValue(response.getWriter(), empresaDAO.listar());
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json;charset=UTF-8");

        try {
            String jsonBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Empresa nuevaEmpresa = objectMapper.readValue(jsonBody, Empresa.class);
            
            boolean exito = empresaDAO.registrar(nuevaEmpresa);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Proveedor registrado correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo registrar. Verifique que el ID de material sea válido."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    // --- NUEVO: SOPORTE PARA ACTUALIZAR ---
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json;charset=UTF-8");

        try {
            String jsonBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Empresa empresaAEditar = objectMapper.readValue(jsonBody, Empresa.class);
            
            boolean exito = empresaDAO.actualizar(empresaAEditar);

            if (exito) {
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Proveedor actualizado correctamente."));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo actualizar el proveedor."));
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    // --- NUEVO: SOPORTE PARA ELIMINAR ---
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json;charset=UTF-8");

        try {
            String idStr = request.getParameter("id");
            if (idStr != null) {
                boolean exito = empresaDAO.eliminar(Integer.parseInt(idStr));
                if (exito) {
                    objectMapper.writeValue(response.getWriter(), new RespuestaApi("success", "Proveedor eliminado."));
                } else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "No se pudo eliminar."));
                }
            }
        } catch (Exception e) {
            enviarError500(e, response);
        }
    }

    private void enviarError500(Exception e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        objectMapper.writeValue(response.getWriter(), new RespuestaApi("error", "Error interno: " + e.getMessage()));
    }

    static class RespuestaApi {
        public String status;
        public String message;
        public RespuestaApi(String status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}