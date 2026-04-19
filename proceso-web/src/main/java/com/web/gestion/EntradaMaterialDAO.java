package com.web.gestion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class EntradaMaterialDAO {
    public boolean registrarEntrada(EntradaMaterial entrada) {
        String sqlInsert = "INSERT INTO entrada_material (id_material, id_empresa, id_persona, nombres_persona, apellidos_persona, cantidad, precio) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        // 2. El SQL del stock
        String sqlUpdateStock = "UPDATE material SET cantidad = cantidad + ? WHERE id_material = ?";
        
        Connection conn = null;
        try {
            conn = ConexionConfig.getConnection();
            conn.setAutoCommit(false); 

            // OPERACIÓN A: Registrar la entrada (7 parámetros)
            try (PreparedStatement psInsert = conn.prepareStatement(sqlInsert)) {
                psInsert.setInt(1, entrada.getId_material());
                psInsert.setInt(2, entrada.getId_empresa());
                psInsert.setString(3, entrada.getId_persona());      // Nuevo: ID Persona
                psInsert.setString(4, entrada.getNombres_persona()); // Nuevo: Nombres
                psInsert.setString(5, entrada.getApellidos_persona()); // Nuevo: Apellidos
                psInsert.setDouble(6, entrada.getCantidad());
                psInsert.setDouble(7, entrada.getPrecio());
                psInsert.executeUpdate();
            }

            // OPERACIÓN B: Actualizar el inventario
            try (PreparedStatement psUpdate = conn.prepareStatement(sqlUpdateStock)) {
                psUpdate.setDouble(1, entrada.getCantidad());
                psUpdate.setInt(2, entrada.getId_material());
                psUpdate.executeUpdate();
            }

            conn.commit(); 
            return true;

        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            e.printStackTrace();
            return false;
        } finally {
            if (conn != null) {
                try { 
                    conn.setAutoCommit(true); 
                    conn.close(); 
                } catch (SQLException e) { 
                    e.printStackTrace(); 
                }
            }
        }
    }
}