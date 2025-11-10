package com.web.gestion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Clase de utilidad para gestionar la conexión a la base de datos.
 * Las constantes han sido extraídas de LoginProcesador para centralizarlas.
 */
public class ConexionConfig {
    
    // CONFIGURACIÓN DE LA BASE DE DATOS
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/proyecto";
    private static final String DB_USER = "root";
    private static final String DB_PASS = ""; 
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver"; 

    /**
     * Se establece y retorna una conexión a la base de datos.
     * @return Objeto Connection.
     * @throws SQLException Si ocurre un error de conexión a la base de datos.
     */
    public static Connection getConnection() throws SQLException {
        // Cargar el driver es solo necesario para entornos antiguos, pero no hace daño.
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            // Este error solo ocurrirá si falta el JAR del driver.
            System.err.println("Error: Driver JDBC de MySQL no encontrado. Asegúrate de que el JAR esté en el classpath.");
            throw new SQLException("Driver MySQL no disponible.", e);
        }
        return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
    }
    
    /**
     * Cierre de forma segura el objeto Connection.
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                // Se loguea el error de cierre, no es crítico para el flujo.
                System.err.println("Error al cerrar la conexión: " + e.getMessage());
            }
        }
    }
}
