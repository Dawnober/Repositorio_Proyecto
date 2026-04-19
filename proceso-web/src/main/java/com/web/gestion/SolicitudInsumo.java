package com.web.gestion;

import java.sql.Timestamp;

public class SolicitudInsumo {
    private int id_solicitud;
    private int id_persona;
    private String tipo_insumo; 
    private int id_recurso;      
    private int cantidad; 
    private Timestamp fecha_solicitud;
    private String observaciones;
    private String estado;
    private String nombreRecurso;
    private String nombreTrabajador;
    private String apellidoTrabajador; 

    public SolicitudInsumo() {
        this.estado = "Pendiente";
    }

    // Getters y Setters
    public int getId_solicitud() { return id_solicitud; }
    public void setId_solicitud(int id_solicitud) { this.id_solicitud = id_solicitud; }

    public int getId_persona() { return id_persona; }
    public void setId_persona(int id_persona) { this.id_persona = id_persona; }

    public String getTipo_insumo() { return tipo_insumo; }
    public void setTipo_insumo(String tipo_insumo) { this.tipo_insumo = tipo_insumo; }

    public int getId_recurso() { return id_recurso; }
    public void setId_recurso(int id_recurso) { this.id_recurso = id_recurso; }

    // CAMBIADO: Getter y Setter para usar int
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public Timestamp getFecha_solicitud() { return fecha_solicitud; }
    public void setFecha_solicitud(Timestamp fecha_solicitud) { this.fecha_solicitud = fecha_solicitud; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getNombreRecurso() { return nombreRecurso; }
    public void setNombreRecurso(String nombreRecurso) { this.nombreRecurso = nombreRecurso; }

    public String getNombreTrabajador() { return nombreTrabajador; }
    public void setNombreTrabajador(String nombreTrabajador) { this.nombreTrabajador = nombreTrabajador; }

    public String getApellidoTrabajador() { return apellidoTrabajador; }
    public void setApellidoTrabajador(String apellidoTrabajador) { this.apellidoTrabajador = apellidoTrabajador; }
}