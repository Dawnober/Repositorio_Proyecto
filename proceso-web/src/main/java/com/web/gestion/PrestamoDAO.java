package com.web.gestion;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PrestamoDAO {

    public List<Prestamo> listarHerramientasEnObra() {
        List<Prestamo> lista = new ArrayList<>();
        String sql = "SELECT s.id_solicitud, p.nombres, p.apellidos, h.nombre as herramienta, " +
                     "s.cantidad, s.fecha_solicitud, s.fecha_devolucion, s.estado, s.nota_daño, s.cant_daño_reportado " +
                     "FROM solicitud_insumo s " +
                     "LEFT JOIN persona p ON s.id_persona = p.id_persona " + 
                     "LEFT JOIN herramienta h ON s.id_recurso = h.id_herramienta " +
                     "WHERE s.tipo_insumo = 'Herramienta' AND (s.estado = 'Aprobado' OR s.estado = 'Devuelto') " + 
                     "ORDER BY s.fecha_solicitud DESC";
        
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Prestamo p = new Prestamo();
                p.setId_solicitud(rs.getInt("id_solicitud"));
                p.setNombreTrabajador(rs.getString("nombres"));
                p.setApellidoTrabajador(rs.getString("apellidos"));
                p.setNombreRecurso(rs.getString("herramienta"));
                p.setCantidad(rs.getBigDecimal("cantidad"));
                p.setFecha_solicitud(rs.getTimestamp("fecha_solicitud"));
                p.setFecha_devolucion(rs.getTimestamp("fecha_devolucion"));
                p.setEstado(rs.getString("estado"));
                p.setNota_dano(rs.getString("nota_daño")); 
                p.setCant_dano_reportado(rs.getInt("cant_daño_reportado"));
                lista.add(p);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return lista;
    }

    public boolean avisarDano(int id, int cant, String nota) {
        String sql = "UPDATE solicitud_insumo SET nota_daño = ?, cant_daño_reportado = ? WHERE id_solicitud = ?";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nota);
            ps.setInt(2, cant);
            ps.setInt(3, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public boolean finalizarRecepcion(int idSol, int cantDanada, String obsAlmacen) {
        Connection con = null;
        try {
            con = ConexionConfig.getConnection();
            con.setAutoCommit(false);

            String sqlI = "SELECT id_recurso, cantidad, id_persona FROM solicitud_insumo WHERE id_solicitud = ?";
            int idRec = 0, totalPrestado = 0, idPersona = 0;
            try (PreparedStatement ps = con.prepareStatement(sqlI)) {
                ps.setInt(1, idSol);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) { 
                    idRec = rs.getInt("id_recurso"); 
                    totalPrestado = rs.getInt("cantidad");
                    idPersona = rs.getInt("id_persona");
                }
            }

            if (cantDanada > 0 && idPersona > 0) {
                String sqlD = "INSERT INTO dano (id_persona, id_recurso, cantidad, descripcion_dano, estado) VALUES (?, ?, ?, ?, 'Pendiente')";
                try (PreparedStatement psD = con.prepareStatement(sqlD)) {
                    psD.setInt(1, idPersona);
                    psD.setInt(2, idRec); 
                    psD.setInt(3, cantDanada); 
                    psD.setString(4, obsAlmacen);
                    psD.executeUpdate();
                }
            }

            int unidadesSanas = totalPrestado - cantDanada;
            if (unidadesSanas > 0) {
                String sqlS = "UPDATE herramienta SET cantidad = cantidad + ? WHERE id_herramienta = ?";
                try (PreparedStatement psS = con.prepareStatement(sqlS)) {
                    psS.setInt(1, unidadesSanas); 
                    psS.setInt(2, idRec); 
                    psS.executeUpdate();
                }
            }

            String sqlF = "UPDATE solicitud_insumo SET estado = 'Devuelto', fecha_devolucion = NOW() WHERE id_solicitud = ?";
            try (PreparedStatement psF = con.prepareStatement(sqlF)) {
                psF.setInt(1, idSol); 
                psF.executeUpdate();
            }

            con.commit();
            return true;
        } catch (Exception e) { 
            if (con != null) try { con.rollback(); } catch (SQLException ex) {} 
            e.printStackTrace();
            return false; 
        } finally {
            if (con != null) try { con.close(); } catch (SQLException e) {}
        }
    }
}