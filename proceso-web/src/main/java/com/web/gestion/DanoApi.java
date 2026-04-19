package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/danos/*")
public class DanoApi extends HttpServlet {

    private final DanoDAO danoDAO = new DanoDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // CONFIGURACIÓN DE CABECERAS (Vital para React)
        resp.setHeader("Access-Control-Allow-Origin", "*"); 
        resp.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        List<Dano> lista = danoDAO.listarTodosLosDanos();
        
        System.out.println("Enviando lista de daños. Tamaño: " + lista.size());
        
        resp.getWriter().write(mapper.writeValueAsString(lista));
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setContentType("application/json");
        try {
            JsonNode root = mapper.readTree(req.getReader());
            int idDano = root.get("id_dano").asInt();
            String estado = root.get("estado").asText();

            boolean ok = danoDAO.gestionarEstadoDano(idDano, estado);
            resp.getWriter().write("{\"success\": " + ok + "}");
        } catch (Exception e) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\": \"Invalid request\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}