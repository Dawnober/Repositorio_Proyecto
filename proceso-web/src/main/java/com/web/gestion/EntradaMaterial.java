package com.web.gestion;

public class EntradaMaterial {
    private int id_material;
    private int id_empresa;
    private String id_persona;
    private String nombres_persona;
    private String apellidos_persona;
    private double cantidad;
    private double precio;

    // Constructor vacío (Necesario para Jackson/ObjectMapper)
    public EntradaMaterial() {}

    // Getters y Setters 
    public int getId_material() { return id_material; }
    public void setId_material(int id_material) { this.id_material = id_material; }
    
    public int getId_empresa() { return id_empresa; }
    public void setId_empresa(int id_empresa) { this.id_empresa = id_empresa; }

    public String getId_persona() { return id_persona; }
    public void setId_persona(String id_persona) { this.id_persona = id_persona; }

    public String getNombres_persona() { return nombres_persona; }
    public void setNombres_persona(String nombres_persona) { this.nombres_persona = nombres_persona; }

    public String getApellidos_persona() { return apellidos_persona; }
    public void setApellidos_persona(String apellidos_persona) { this.apellidos_persona = apellidos_persona; }

    // Getters y Setters de valores numéricos
    public double getCantidad() { return cantidad; }
    public void setCantidad(double cantidad) { this.cantidad = cantidad; }
    
    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }
}