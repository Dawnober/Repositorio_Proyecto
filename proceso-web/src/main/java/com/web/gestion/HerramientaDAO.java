package com.web.gestion;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HerramientaDAO {

    public List<Herramienta> listarHerramientas() {
        List<Herramienta> lista = new ArrayList<>();
        String sql = "SELECT id_herramienta, fecha, nombre, cantidad, estado, descripcion FROM herramienta";
        
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                Herramienta h = new Herramienta();
                h.setId(rs.getInt("id_herramienta"));
                h.setFecha(rs.getTimestamp("fecha"));
                h.setNombre(rs.getString("nombre"));
                h.setCantidad(rs.getInt("cantidad"));
                h.setEstado(rs.getString("estado"));
                h.setDescripcion(rs.getString("descripcion"));
                lista.add(h);
            }
        } catch (SQLException e) {
            System.err.println("Error al listar herramientas: " + e.getMessage());
            e.printStackTrace();
        }
        return lista;
    }

    public boolean registrarHerramienta(Herramienta h) {
        // Omitimos 'id_herramienta' (es auto_increment) y 'fecha' (será automática en BD)
        String sql = "INSERT INTO herramienta (nombre, cantidad, estado, descripcion) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, h.getNombre());
            ps.setInt(2, h.getCantidad());
            ps.setString(3, h.getEstado());
            ps.setString(4, h.getDescripcion());
            
            int filas = ps.executeUpdate();
            return filas > 0;
            
        } catch (SQLException e) {
            // Este print es vital para ver por qué falla el INSERT en la consola
            System.err.println("ERROR SQL en registrarHerramienta: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean actualizarHerramienta(Herramienta h) {
        String sql = "UPDATE herramienta SET nombre = ?, cantidad = ?, estado = ?, descripcion = ? WHERE id_herramienta = ?";
        
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, h.getNombre());
            ps.setInt(2, h.getCantidad());
            ps.setString(3, h.getEstado());
            ps.setString(4, h.getDescripcion());
            ps.setInt(5, h.getId()); 
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error al actualizar herramienta: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean eliminarHerramienta(int id) {
        String sql = "DELETE FROM herramienta WHERE id_herramienta = ?";
        
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Error al eliminar herramienta: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}