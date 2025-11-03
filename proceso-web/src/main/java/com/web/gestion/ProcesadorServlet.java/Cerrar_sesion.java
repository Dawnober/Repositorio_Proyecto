
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Servlet encargado de cerrar la sesión del usuario de forma segura.
 * Mapeado a /Cerrar_sesion.
 */
@WebServlet("/Cerrar_sesion")
public class Cerrar_sesion extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * Procesa peticiones POST (el método recomendado para cerrar sesión).
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener la sesión actual (si existe). 'false' evita crear una nueva.
        HttpSession session = request.getSession(false); 
        
        if (session != null) {
            // 2. Invalidar la sesión y eliminar todos los atributos (isLoggedIn, userRol, etc.)
            // Esta es la acción clave para cerrar sesión.
            session.invalidate();
        }
        
        // 3. Redirigir al usuario a la página de inicio de sesión después de cerrar la sesión.
        response.sendRedirect("index.jsp");
    }

    /**
     * Se maneja peticiones GET. Por seguridad y conveniencia, también se dirige al cierre de sesión.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Llama a doPost para aplicar la lógica de cierre de sesión
        doPost(request, response);
    }
}