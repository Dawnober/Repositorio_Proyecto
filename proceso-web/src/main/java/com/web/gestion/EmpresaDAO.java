package com.web.gestion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EmpresaDAO {
    
    // Consulta de inserción: Solo usamos id_material (FK)
    private static final String INSERT = "INSERT INTO empresa (empresa, id_material, telefono, direccion) VALUES (?, ?, ?, ?)";
    
    // CONSULTA CORREGIDA: m.nombre es el nombre real en tu tabla 'material' (visto en image_1d9883.png)
    private static final String SELECT_ALL = "SELECT e.id_empresa, e.empresa, e.id_material, m.nombre AS nombre_material_db, e.telefono, e.direccion " +
                                             "FROM empresa e " +
                                             "LEFT JOIN material m ON e.id_material = m.id_material";
                                             
    private static final String DELETE = "DELETE FROM empresa WHERE id_empresa = ?";
    
    private static final String UPDATE = "UPDATE empresa SET empresa = ?, id_material = ?, telefono = ?, direccion = ? WHERE id_empresa = ?";

    public boolean registrar(Empresa e) {
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(INSERT)) {
            
            ps.setString(1, e.getEmpresa());
            ps.setInt(2, e.getIdMaterial()); 
            ps.setString(3, e.getTelefono());
            ps.setString(4, e.getDireccion());
            
            return ps.executeUpdate() > 0;
            
        } catch (SQLException ex) {
            System.err.println("❌ Error SQL al registrar: " + ex.getMessage());
            return false;
        }
    }

    public List<Empresa> listar() {
        List<Empresa> lista = new ArrayList<>();
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(SELECT_ALL);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                Empresa e = new Empresa();
                e.setId(rs.getInt("id_empresa"));
                e.setEmpresa(rs.getString("empresa"));
                e.setIdMaterial(rs.getInt("id_material"));
                
                // Obtenemos el nombre del material usando el alias 'nombre_material_db'
                String nombreMat = rs.getString("nombre_material_db");
                
                // Si el material existe lo ponemos, si no, avisamos
                e.setNombreMaterial(nombreMat != null ? nombreMat : "Material no asignado");
                
                e.setTelefono(rs.getString("telefono"));
                e.setDireccion(rs.getString("direccion"));
                lista.add(e);
            }
        } catch (SQLException ex) {
            System.err.println("❌ Error al listar proveedores: " + ex.getMessage());
            ex.printStackTrace();
        }
        return lista;
    }

    public boolean eliminar(int id) {
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(DELETE)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("❌ Error al eliminar: " + ex.getMessage());
            return false;
        }
    }

    public boolean actualizar(Empresa e) {
        try (Connection conn = ConexionConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(UPDATE)) {
            ps.setString(1, e.getEmpresa());
            ps.setInt(2, e.getIdMaterial());
            ps.setString(3, e.getTelefono());
            ps.setString(4, e.getDireccion());
            ps.setInt(5, e.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            System.err.println("❌ Error al actualizar: " + ex.getMessage());
            return false;
        }
    }
}