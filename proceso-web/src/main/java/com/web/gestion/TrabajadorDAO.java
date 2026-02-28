package com.web.gestion;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

public class TrabajadorDAO {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/proyecto";
    private static final String DB_USER = "root";
    private static final String DB_PASS = ""; 

    protected Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS);
    }

    // --- REGISTRAR ---
    public boolean registrarTrabajador(Trabajador t) {
        String sqlPersona = "INSERT INTO persona (nombres, apellidos, correo, rol, password_hash) VALUES (?, ?, ?, ?, ?)";
        String sqlTrabajador = "INSERT INTO trabajador_autorizado (id_trabajador_autorizado, identificacion, telefono) VALUES (?, ?, ?)";
        
        Connection conn = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement psP = conn.prepareStatement(sqlPersona, Statement.RETURN_GENERATED_KEYS)) {
                psP.setString(1, t.getNombres());
                psP.setString(2, t.getApellidos());
                psP.setString(3, t.getCorreo());
                psP.setString(4, "trabajador_autorizado");
                psP.setString(5, BCrypt.hashpw(t.getPassword_hash(), BCrypt.gensalt()));
                
                psP.executeUpdate();
                ResultSet generatedKeys = psP.getGeneratedKeys();
                if (generatedKeys.next()) {
                    int idGenerado = generatedKeys.getInt(1);
                    try (PreparedStatement psT = conn.prepareStatement(sqlTrabajador)) {
                        psT.setInt(1, idGenerado); 
                        psT.setString(2, t.getIdentificacion());
                        psT.setString(3, t.getTelefono());
                        psT.executeUpdate();
                    }
                }
                conn.commit();
                return true;
            } catch (SQLException e) {
                if (conn != null) conn.rollback();
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            closeConnection(conn);
        }
        return false;
    }

    // --- LISTAR ---
    public List<Trabajador> listarTrabajadores() {
        List<Trabajador> lista = new ArrayList<>();
        String sql = "SELECT p.id_persona, p.nombres, p.apellidos, p.correo, t.identificacion, t.telefono " +
                     "FROM persona p " +
                     "INNER JOIN trabajador_autorizado t ON p.id_persona = t.id_trabajador_autorizado " +
                     "WHERE p.rol = 'trabajador_autorizado'";
        
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Trabajador t = new Trabajador();
                t.setIdPersona(rs.getInt("id_persona"));
                t.setNombres(rs.getString("nombres"));
                t.setApellidos(rs.getString("apellidos"));
                t.setCorreo(rs.getString("correo"));
                t.setIdentificacion(rs.getString("identificacion"));
                t.setTelefono(rs.getString("telefono"));
                lista.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }

    // --- ACTUALIZAR ---
    public boolean actualizarTrabajador(Trabajador t) {
        String sqlPersona = "UPDATE persona SET nombres = ?, apellidos = ?, correo = ? WHERE id_persona = ?";
        String sqlTrabajador = "UPDATE trabajador_autorizado SET identificacion = ?, telefono = ? WHERE id_trabajador_autorizado = ?";
        
        Connection conn = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false); // Iniciar transacción

            // 1. Actualizar tabla Persona
            try (PreparedStatement psP = conn.prepareStatement(sqlPersona)) {
                psP.setString(1, t.getNombres());
                psP.setString(2, t.getApellidos());
                psP.setString(3, t.getCorreo());
                psP.setInt(4, t.getIdPersona());
                psP.executeUpdate();
            }

            // 2. Actualizar tabla Trabajador_Autorizado
            try (PreparedStatement psT = conn.prepareStatement(sqlTrabajador)) {
                psT.setString(1, t.getIdentificacion());
                psT.setString(2, t.getTelefono());
                psT.setInt(3, t.getIdPersona());
                psT.executeUpdate();
            }

            conn.commit(); // Guardar cambios
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            e.printStackTrace();
            return false;
        } finally {
            closeConnection(conn);
        }
    }

    // --- ELIMINAR ---
    public boolean eliminarTrabajador(int id) {
        // Al eliminar de 'persona', si tienes ON DELETE CASCADE en la FK de la base de datos, 
        // se borrará automáticamente de 'trabajador_autorizado'. 
        // Si no, borramos primero el trabajador y luego la persona.
        String sqlTrabajador = "DELETE FROM trabajador_autorizado WHERE id_trabajador_autorizado = ?";
        String sqlPersona = "DELETE FROM persona WHERE id_persona = ?";
        
        Connection conn = null;
        try {
            conn = getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement psT = conn.prepareStatement(sqlTrabajador)) {
                psT.setInt(1, id);
                psT.executeUpdate();
            }

            try (PreparedStatement psP = conn.prepareStatement(sqlPersona)) {
                psP.setInt(1, id);
                psP.executeUpdate();
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
            closeConnection(conn);
        }
    }

    // Método utilitario para cerrar conexión
    private void closeConnection(Connection conn) {
        if (conn != null) {
            try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
}