package com.web.gestion;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SolicitudInsumoDAO {
    
    private static final String LISTAR_BASE_SQL = 
        "SELECT s.*, p.nombres as nombre_trabajador, p.apellidos as apellido_trabajador, " +
        "CASE " +
        "  WHEN s.tipo_insumo = 'Material' THEN m.nombre " +
        "  WHEN s.tipo_insumo = 'Herramienta' THEN h.nombre " +
        "  ELSE 'Desconocido' " +
        "END as nombre_recurso " +
        "FROM solicitud_insumo s " +
        "JOIN persona p ON s.id_persona = p.id_persona " + 
        "LEFT JOIN material m ON s.id_recurso = m.id_material AND s.tipo_insumo = 'Material' " +
        "LEFT JOIN herramienta h ON s.id_recurso = h.id_herramienta AND s.tipo_insumo = 'Herramienta' ";

    public SolicitudInsumo obtenerPorId(int id) {
        String sql = LISTAR_BASE_SQL + " WHERE s.id_solicitud = ?";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapearSolicitud(rs);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean registrarSolicitud(SolicitudInsumo sol) {
        String sql = "INSERT INTO solicitud_insumo (id_persona, tipo_insumo, id_recurso, cantidad, observaciones, estado, fecha_solicitud) VALUES (?, ?, ?, ?, ?, 'Pendiente', NOW())";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, sol.getId_persona());
            ps.setString(2, sol.getTipo_insumo());
            ps.setInt(3, sol.getId_recurso());
            ps.setInt(4, sol.getCantidad());
            ps.setString(5, sol.getObservaciones());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public List<SolicitudInsumo> listarTodas() {
        List<SolicitudInsumo> lista = new ArrayList<>();
        String sql = LISTAR_BASE_SQL + " ORDER BY s.fecha_solicitud DESC";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapearSolicitud(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return lista;
    }

    public List<SolicitudInsumo> listarPorTrabajador(int id) {
        List<SolicitudInsumo> lista = new ArrayList<>();
        String sql = LISTAR_BASE_SQL + " WHERE s.id_persona = ? ORDER BY s.fecha_solicitud DESC";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapearSolicitud(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return lista;
    }

    public List<SolicitudInsumo> listarHerramientasActivasPorTrabajador(int idTrabajador) {
        List<SolicitudInsumo> lista = new ArrayList<>();
        String sql = LISTAR_BASE_SQL + " WHERE s.id_persona = ? AND s.tipo_insumo = 'Herramienta' AND s.estado = 'Aprobado'";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idTrabajador);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(mapearSolicitud(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return lista;
    }

    public boolean actualizarEstado(int id, String nuevoEstado) {
        Connection con = null;
        try {
            con = ConexionConfig.getConnection();
            con.setAutoCommit(false);
            SolicitudInsumo sol = obtenerPorId(id);
            if (sol == null) return false;

            if (nuevoEstado.equalsIgnoreCase("Aprobado") && !sol.getEstado().equalsIgnoreCase("Aprobado")) {
                String tabla = sol.getTipo_insumo().equalsIgnoreCase("Material") ? "material" : "herramienta";
                String pk = sol.getTipo_insumo().equalsIgnoreCase("Material") ? "id_material" : "id_herramienta";
                String sqlInv = "UPDATE " + tabla + " SET cantidad = cantidad - ? WHERE " + pk + " = ?";
                try (PreparedStatement psInv = con.prepareStatement(sqlInv)) {
                    psInv.setInt(1, sol.getCantidad());
                    psInv.setInt(2, sol.getId_recurso());
                    psInv.executeUpdate();
                }
            }

            String sqlUpdate = "UPDATE solicitud_insumo SET estado = ? WHERE id_solicitud = ?";
            try (PreparedStatement psUpdate = con.prepareStatement(sqlUpdate)) {
                psUpdate.setString(1, nuevoEstado);
                psUpdate.setInt(2, id);
                psUpdate.executeUpdate();
            }
            con.commit();
            return true;
        } catch (SQLException e) {
            if (con != null) try { con.rollback(); } catch (SQLException ex) {}
            return false;
        } finally {
            if (con != null) try { con.close(); } catch (SQLException e) {}
        }
    }

    public int obtenerIdPorCorreo(String correo) {
        String sql = "SELECT id_persona FROM persona WHERE correo = ?";
        try (Connection con = ConexionConfig.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, correo);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt("id_persona");
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return -1;
    }

    private SolicitudInsumo mapearSolicitud(ResultSet rs) throws SQLException {
    SolicitudInsumo s = new SolicitudInsumo();
    s.setId_solicitud(rs.getInt("id_solicitud"));
    s.setId_persona(rs.getInt("id_persona"));
    s.setTipo_insumo(rs.getString("tipo_insumo"));
    s.setId_recurso(rs.getInt("id_recurso"));
    s.setCantidad(rs.getInt("cantidad"));
    s.setEstado(rs.getString("estado"));
    // Esta línea es clave para que React reciba el valor
    s.setFecha_solicitud(rs.getTimestamp("fecha_solicitud")); 
    s.setNombreRecurso(rs.getString("nombre_recurso"));
    s.setNombreTrabajador(rs.getString("nombre_trabajador"));
    s.setApellidoTrabajador(rs.getString("apellido_trabajador"));
    return s;
}
}