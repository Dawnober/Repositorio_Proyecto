package com.web.gestion;

import java.math.BigDecimal; 

public class Material {
    private String nombre;
    // Se usa BigDecimal para cantidades para evitar problemas de coma flotante
    private BigDecimal cantidad; 
    private String unidad; // Ejemplo: 'bultos', 'metros', 'ladrillos'
    private String descripcion;
    

    // 1. Constructor vacío (¡CRUCIAL para Jackson!)
    public Material() {} 

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
               "nombre='" + nombre + '\'' +
               ", cantidad=" + cantidad + 
               ", unidad='" + unidad + '\'' + 
               ", descripcion='" + descripcion + '\'' + 
               '}';
    }
}