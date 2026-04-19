package com.web.gestion;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

@WebServlet("/api/entrada-material")
public class EntradaMaterialApi extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final EntradaMaterialDAO entradaDAO = new EntradaMaterialDAO();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Configuración necesaria para evitar errores de CORS en el navegador
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Seteamos el origen y la codificación antes de cualquier operación
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json;charset=UTF-8");
        request.setCharacterEncoding("UTF-8"); // Importante para nombres con tildes o Ñ

        try {
            // 1. Leemos el cuerpo del JSON que viene de React
            String jsonBody = request.getReader().lines()
                    .collect(Collectors.joining(System.lineSeparator()));
            
            // 2. Jackson mapea automáticamente id_persona, nombres_persona, etc.
            EntradaMaterial nuevaEntrada = objectMapper.readValue(jsonBody, EntradaMaterial.class);
            
            // 3. Procesamos el registro a través del DAO
            boolean exito = entradaDAO.registrarEntrada(nuevaEntrada);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                objectMapper.writeValue(response.getWriter(), 
                    new RespuestaApi("success", "Entrada registrada: " + nuevaEntrada.getCantidad() + " unidades añadidas al stock."));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                objectMapper.writeValue(response.getWriter(), 
                    new RespuestaApi("error", "Error en base de datos. Verifique IDs de material y empresa."));
            }
        } catch (Exception e) {
            e.printStackTrace(); // Esto imprimirá el error exacto en la consola de Tomcat
            enviarError500(e, response);
        }
    }

    private void enviarError500(Exception e, HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        objectMapper.writeValue(response.getWriter(), 
            new RespuestaApi("error", "Error interno en el servidor: " + e.getMessage()));
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