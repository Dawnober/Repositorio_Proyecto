package com.web.gestion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionConfig {
    
    // Agregamos parámetros para evitar errores de SSL y Timezone comunes en Connector/J 8.x
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/proyecto?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASS = ""; 
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver"; 

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName(DRIVER);
            return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver MySQL no encontrado en el proyecto.", e);
        }
    }
}