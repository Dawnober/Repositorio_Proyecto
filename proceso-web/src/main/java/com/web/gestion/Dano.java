package com.web.gestion;

import java.sql.Timestamp;

public class Dano {
    private int id_dano;
    private String nombreHerramienta;
    private int cantidad;
    private String descripcion_dano;
    private String estado;
    private Timestamp fecha_reporte;
    private String nombre; // Se mapeará desde 'nombres'
    private String apellido; // Se mapeará desde 'apellidos'

    public Dano() {}

    // Getters y Setters
    public int getId_dano() { return id_dano; }
    public void setId_dano(int id_dano) { this.id_dano = id_dano; }

    public String getNombreHerramienta() { return nombreHerramienta; }
    public void setNombreHerramienta(String nombreHerramienta) { this.nombreHerramienta = nombreHerramienta; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public String getDescripcion_dano() { return descripcion_dano; }
    public void setDescripcion_dano(String descripcion_dano) { this.descripcion_dano = descripcion_dano; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Timestamp getFecha_reporte() { return fecha_reporte; }
    public void setFecha_reporte(Timestamp fecha_reporte) { this.fecha_reporte = fecha_reporte; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

}