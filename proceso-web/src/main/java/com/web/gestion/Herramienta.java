package com.web.gestion;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Timestamp;

public class Herramienta {
    
    @JsonProperty("id_herramienta")
    private int id;
    private Timestamp fecha;
    private String nombre;
    private int cantidad;
    private String estado;
    private String descripcion;

    public Herramienta() {}

    // --- ID (Unificado estilo Material.java) ---
    public int getId() { 
        return id; 
    }

    public void setId(int id) { 
        this.id = id; 
    }

    // --- RESTO DE GETTERS Y SETTERS ---
    public Timestamp getFecha() { return fecha; }
    public void setFecha(Timestamp fecha) { this.fecha = fecha; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}