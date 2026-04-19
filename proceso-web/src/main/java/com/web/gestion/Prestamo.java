package com.web.gestion;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Prestamo {
    private int id_solicitud;
    private String nombreTrabajador;
    private String apellidoTrabajador;
    private String nombreRecurso;
    private BigDecimal cantidad;
    private Timestamp fecha_solicitud; 
    private Timestamp fecha_devolucion;
    private String estado;
    private String nota_dano; 
    private int cant_dano_reportado;

    public Prestamo() {}

    // Getters y Setters
    public int getId_solicitud() { return id_solicitud; }
    public void setId_solicitud(int id_solicitud) { this.id_solicitud = id_solicitud; }

    public String getNombreTrabajador() { return nombreTrabajador; }
    public void setNombreTrabajador(String n) { this.nombreTrabajador = n; }

    public String getApellidoTrabajador() { return apellidoTrabajador; }
    public void setApellidoTrabajador(String a) { this.apellidoTrabajador = a; }

    public String getNombreRecurso() { return nombreRecurso; }
    public void setNombreRecurso(String nr) { this.nombreRecurso = nr; }

    public BigDecimal getCantidad() { return cantidad; }
    public void setCantidad(BigDecimal c) { this.cantidad = c; }

    public Timestamp getFecha_solicitud() { return fecha_solicitud; }
    public void setFecha_solicitud(Timestamp f) { this.fecha_solicitud = f; }

    public Timestamp getFecha_devolucion() { return fecha_devolucion; }
    public void setFecha_devolucion(Timestamp f) { this.fecha_devolucion = f; }

    public String getEstado() { return estado; }
    public void setEstado(String e) { this.estado = e; }

    public String getNota_dano() { return nota_dano; }
    public void setNota_dano(String n) { this.nota_dano = n; }
    
    public int getCant_dano_reportado() { return cant_dano_reportado; }
    public void setCant_dano_reportado(int c) { this.cant_dano_reportado = c; }
}