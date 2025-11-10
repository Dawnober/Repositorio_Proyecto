package com.web.gestion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class MaterialDAO {
    
    private static final String INSERT_MATERIAL_SQL = 
        "INSERT INTO material (nombre, cantidad, unidad, descripcion) VALUES (?, ?, ?, ?)";

    /**
     * Guarda un nuevo registro de material en la base de datos MySQL.
     * @param material El objeto Material a guardar.
     * @return true si la inserción fue exitosa, false en caso contrario.
     */
    // Se usa el nombre corto de la clase Material
    public boolean guardarMaterial(Material material) {
        
        // Se usa el nombre corto de la clase ConexionConfig.
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(INSERT_MATERIAL_SQL)) { 
            
            ps.setString(1, material.getNombre());
            ps.setBigDecimal(2, material.getCantidad()); 
            ps.setString(3, material.getUnidad());
            ps.setString(4, material.getDescripcion());
            
            return ps.executeUpdate() > 0;
            
        } catch (SQLException e) {
            System.err.println("❌ Error en MaterialDAO al intentar guardar material: " + material.getNombre());
            e.printStackTrace();
            return false;
        }
    }
}