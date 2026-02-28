package com.web.gestion;

public class Trabajador {
    private int idPersona;
    private String nombres;
    private String apellidos;
    private String correo;
    private String password_hash; // ✅ Sincronizado con React y la DB
    private String identificacion;
    private String telefono;
    private String rol = "trabajador_autorizado";

    public Trabajador() {}

    // Getters y Setters actualizados
    public int getIdPersona() { return idPersona; }
    public void setIdPersona(int idPersona) { this.idPersona = idPersona; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getPassword_hash() { return password_hash; } // ✅ Actualizado
    public void setPassword_hash(String password_hash) { this.password_hash = password_hash; } // ✅ Actualizado

    public String getIdentificacion() { return identificacion; }
    public void setIdentificacion(String identificacion) { this.identificacion = identificacion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getRol() { return rol; }
}