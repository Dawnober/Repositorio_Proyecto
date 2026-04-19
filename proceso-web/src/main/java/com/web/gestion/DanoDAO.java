package com.web.gestion;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DanoDAO {

    public List<Dano> listarTodosLosDanos() {
        List<Dano> lista = new ArrayList<>();
        String sql = "SELECT d.id_dano, h.nombre AS herramienta, d.cantidad, d.descripcion_dano, " +
                     "d.estado, d.fecha_reporte, p.nombres, p.apellidos " +
                     "FROM dano d " +
                     "LEFT JOIN herramienta h ON d.id_recurso = h.id_herramienta " +
                     "LEFT JOIN persona p ON d.id_persona = p.id_persona " + 
                     "ORDER BY d.fecha_reporte DESC";

        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Dano d = new Dano();
                d.setId_dano(rs.getInt("id_dano"));
                d.setNombreHerramienta(rs.getString("herramienta"));
                d.setCantidad(rs.getInt("cantidad"));
                d.setDescripcion_dano(rs.getString("descripcion_dano"));
                d.setEstado(rs.getString("estado"));
                d.setFecha_reporte(rs.getTimestamp("fecha_reporte"));
                
                // Mapeo manual: columna plural de DB -> atributo singular de Java
                d.setNombre(rs.getString("nombres"));    
                d.setApellido(rs.getString("apellidos")); 
                
                lista.add(d);
            }
        } catch (SQLException e) { 
            System.err.println("Error en DanoDAO.listarTodosLosDanos: " + e.getMessage());
            e.printStackTrace(); 
        }
        return lista;
    }

    public boolean gestionarEstadoDano(int idDano, String nuevoEstado) {
        Connection con = null;
        try {
            con = ConexionConfig.getConnection();
            con.setAutoCommit(false);

            int idRecurso = -1;
            int cantidadAfectada = 0;
            String sqlInfo = "SELECT id_recurso, cantidad FROM dano WHERE id_dano = ?";
            
            try (PreparedStatement psInfo = con.prepareStatement(sqlInfo)) {
                psInfo.setInt(1, idDano);
                ResultSet rs = psInfo.executeQuery();
                if (rs.next()) {
                    idRecurso = rs.getInt("id_recurso");
                    cantidadAfectada = rs.getInt("cantidad");
                }
            }

            if ("Reparado".equalsIgnoreCase(nuevoEstado) && idRecurso != -1) {
                String sqlStock = "UPDATE herramienta SET cantidad = cantidad + ? WHERE id_herramienta = ?";
                try (PreparedStatement psStock = con.prepareStatement(sqlStock)) {
                    psStock.setInt(1, cantidadAfectada);
                    psStock.setInt(2, idRecurso);
                    psStock.executeUpdate();
                }
            }

            String sqlUpdate = "UPDATE dano SET estado = ? WHERE id_dano = ?";
            try (PreparedStatement psUpdate = con.prepareStatement(sqlUpdate)) {
                psUpdate.setString(1, nuevoEstado);
                psUpdate.setInt(2, idDano);
                psUpdate.executeUpdate();
            }

            con.commit();
            return true;
        } catch (SQLException e) {
            if (con != null) try { con.rollback(); } catch (SQLException ex) {}
            e.printStackTrace();
            return false;
        } finally {
            if (con != null) try { con.close(); } catch (SQLException e) {}
        }
    }
}