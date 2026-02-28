package com.web.gestion;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Empresa {
    @JsonProperty("id_empresa")
    private int id;
    private String empresa; 
    
    @JsonProperty("id_material")
    private int idMaterial; 
    
    private String nombreMaterial; 
    private String telefono;
    private String direccion;

    public Empresa() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public int getIdMaterial() { return idMaterial; }
    public void setIdMaterial(int idMaterial) { this.idMaterial = idMaterial; }

    public String getNombreMaterial() { return nombreMaterial; }
    public void setNombreMaterial(String nombreMaterial) { this.nombreMaterial = nombreMaterial; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}