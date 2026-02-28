package com.web.gestion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MaterialDAO {
    
    // Agregamos 'fecha' al INSERT. Usamos CURDATE() para que MySQL ponga la fecha actual automáticamente.
    private static final String INSERT_MATERIAL_SQL = 
        "INSERT INTO material (nombre, cantidad, unidad, descripcion, fecha) VALUES (?, ?, ?, ?, CURDATE())";

    // Agregamos 'fecha' al SELECT
    private static final String SELECT_ALL_MATERIALES = 
        "SELECT id_material, fecha, nombre, cantidad, unidad, descripcion FROM material";

    private static final String UPDATE_MATERIAL_SQL = 
        "UPDATE material SET nombre = ?, cantidad = ?, unidad = ?, descripcion = ? WHERE id_material = ?";

    private static final String DELETE_MATERIAL_SQL = 
        "DELETE FROM material WHERE id_material = ?";

    /**
     * Guarda un nuevo registro de material incluyendo la fecha actual.
     */
    public boolean registrarMaterial(Material material) {
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

    /**
     * Obtiene todos los materiales incluyendo el campo fecha.
     */
    public List<Material> listarMateriales() {
        List<Material> materiales = new ArrayList<>();
        
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(SELECT_ALL_MATERIALES);
             ResultSet rs = ps.executeQuery()) { 
            
            while (rs.next()) {
                Material material = new Material();
                material.setId(rs.getInt("id_material"));
                // --- ASIGNACIÓN DE FECHA ---
                material.setFecha(rs.getString("fecha")); 
                material.setNombre(rs.getString("nombre"));
                material.setCantidad(rs.getBigDecimal("cantidad"));
                material.setUnidad(rs.getString("unidad"));
                material.setDescripcion(rs.getString("descripcion"));
                
                materiales.add(material);
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Error en MaterialDAO al listar materiales.");
            e.printStackTrace();
        }
        
        return materiales;
    }

    public boolean actualizarMaterial(Material material) {
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(UPDATE_MATERIAL_SQL)) {
            
            ps.setString(1, material.getNombre());
            ps.setBigDecimal(2, material.getCantidad());
            ps.setString(3, material.getUnidad());
            ps.setString(4, material.getDescripcion());
            ps.setInt(5, material.getId());
            
            return ps.executeUpdate() > 0;
            
        } catch (SQLException e) {
            System.err.println("❌ Error al actualizar material: " + material.getId());
            e.printStackTrace();
            return false;
        }
    }

    public boolean eliminarMaterial(int id) {
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(DELETE_MATERIAL_SQL)) {
            
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
            
        } catch (SQLException e) {
            System.err.println("❌ Error al eliminar material: " + id);
            e.printStackTrace();
            return false;
        }
    }
}