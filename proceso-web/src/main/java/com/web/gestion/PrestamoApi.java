package com.web.gestion;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/prestamos/*")
public class PrestamoApi extends HttpServlet {
    private final ObjectMapper mapper = new ObjectMapper();
    private final PrestamoDAO dao = new PrestamoDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        JsonNode root = mapper.readTree(req.getReader());
        String accion = root.get("accion").asText();
        int id = root.get("id_solicitud").asInt();
        
        // Llaves del JSON ajustadas
        int cant = root.path("cant_reportada").asInt(0); 
        String desc = root.path("nota").asText("Sin observaciones");

        boolean ok;
        if ("REPORTAR_TRABAJADOR".equals(accion)) {
            ok = dao.avisarDano(id, cant, desc);
        } else {
            ok = dao.finalizarRecepcion(id, cant, desc);
        }

        resp.getWriter().write("{\"status\": \"" + (ok ? "success" : "error") + "\"}");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        List<Prestamo> lista = dao.listarHerramientasEnObra();
        resp.getWriter().write(mapper.writeValueAsString(lista));
    } 
}