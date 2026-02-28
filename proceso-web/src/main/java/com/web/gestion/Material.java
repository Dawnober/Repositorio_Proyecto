package com.web.gestion;

import java.math.BigDecimal; 
import com.fasterxml.jackson.annotation.JsonProperty;

public class Material {
    
    @JsonProperty("id_material")
    private int id; 
    
    private String fecha; // Nuevo campo para la fecha de ingreso
    private String nombre;
    private BigDecimal cantidad; 
    private String unidad; 
    private String descripcion;

    // 1. Constructor vacío (¡CRUCIAL para Jackson!)
    public Material() {} 

    // --- ID ---
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    // --- FECHA ---
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    // --- NOMBRE ---
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    // --- CANTIDAD ---
    public BigDecimal getCantidad() {
        return cantidad;
    }
    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }
    
    // --- UNIDAD ---
    public String getUnidad() {
        return unidad;
    }
    public void setUnidad(String unidad) {
        this.unidad = unidad;
    }
    
    // --- DESCRIPCIÓN ---
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    @Override
    public String toString() {
        return "Material{" +
                "id=" + id +
                ", fecha='" + fecha + '\'' +
                ", nombre='" + nombre + '\'' +
                ", cantidad=" + cantidad + 
                ", unidad='" + unidad + '\'' + 
                ", descripcion='" + descripcion + '\'' + 
                '}';
    }
}