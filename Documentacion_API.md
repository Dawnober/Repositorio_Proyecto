# Documentación de la API: Servicios de Gestión de Materiales

Este documento describe el servicio web REST implementado en la clase `MaterialApi.java`, parte del proyecto `proceso-web`.

---

## 1. Definición de la Entidad: `Material`

Para interactuar con el endpoint, el cliente debe enviar un objeto **JSON** que se mapee a la estructura de la clase Java **`Material`**.

** Aqui van los campos de la tabla con los atributos exactos de la clase `Material.java`**.

| Campo | Tipo Esperado | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **`nombre`** | `String` | Sí | Nombre o descriptor del material. |
| **`cantidad`** | `BigDecimal` | Sí | Stock o cantidad inicial del material. |
| **`unidad`** | `String` | Sí | Unidad de medida (Ej: "kg", "bultos"). |
| `descripcion` | `String` | No | Descripcion del material, el para que sirve o para que se utilizara. |

---

## 2. Servicio: Registrar Nuevo Material

Este servicio está implementado por el método **`doPost`** en la clase `MaterialApi.java`. Permite crear y persistir un nuevo registro de material en la base de datos.

### A. Parámetros del Endpoint

| Propiedad | Valor |
| :--- | :--- |
| **Método HTTP** | **`POST`** |
| **Ruta del Recurso** | `/api/materiales` |
| **Función** | Crear un nuevo registro de material en la base de datos. |
| **Tipo de Contenido** | `application/json` |

### B. Solicitud (Request Body)

Se debe enviarse un objeto JSON que cumpla con la estructura de la Entidad `Material`.

**Ejemplo de JSON a Enviar (para referencia):**

```json
{
  "nombre": "cemento",
  "cantidad": 100,
  "unidad": "bultos",
  "descripcion": "", 
}
```

### C. Respuestas (Response Status Codes)

El servicio retorna un mensaje JSON (`RespuestaApi`) junto con el código de estado HTTP para indicar el resultado de la operación.

| Código HTTP | Estado Interno | Descripción | Ejemplo de JSON Retornado |
| :--- | :--- | :--- | :--- |
| **201 Created** | `success` | El registro fue creado exitosamente. | ```json{ "status": "success", "message": "Material 'Tubos PVC' registrado correctamente."}``` |
| **400 Bad Request** | `error` | No se pudo guardar el material (falla en la lógica de negocio o datos inválidos). | ```json{ "status": "error", "message": "Error: No se pudo guardar el material en la base de datos."}``` |
| **500 Internal Server Error** | `error` | Error inesperado en el servidor (Ej: fallo de conexión a la BD, error al leer el JSON). | ```json{ "status": "error", "message": "Error interno del servidor. Revise los logs."}``` |