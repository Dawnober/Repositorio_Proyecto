import React, { useState } from 'react';

function RegistroMaterial() {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState(''); 
    const [unidad, setUnidad] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const datosMaterial = { 
            nombre: nombre, 
            cantidad: parseFloat(cantidad), // Convertir a número antes de enviar
            unidad: unidad,
            descripcion: descripcion,
        };

        const apiUrl = window.location.origin + '/proyecto-web/api/materiales'; 

        try {
            const response = await fetch(apiUrl, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosMaterial), 
            });

            const data = await response.json();

            if (response.ok) { 
                setMessage({ type: 'success', text: data.message });
                setNombre(''); setCantidad(''); setUnidad(''); setDescripcion('');
            } else { 
                // Se usa el mensaje del backend o un genérico
                setMessage({ type: 'error', text: data.message || 'Error desconocido al registrar.' });
            }

        } catch (error) {
            console.error('Error de red/conexión:', error);
            setMessage({ type: 'error', text: 'No se pudo conectar con el servidor. Verifique que Tomcat esté corriendo y la URL de la API.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        // Se usa 'registro-card' como contenedor principal (la tarjeta blanca)
        <div className="registro-card"> 
            
            {/* <h2> y Subtítulo */}
            <h2>Registro de Material</h2>
            {/* <p style={{ color: '#666', marginBottom: '25px', fontSize: '17px' }}>Completa los datos del nuevo material.</p> */}

            {/* Mensajes de feedback (se usa estilos inline simples) */}
            {message && (
                <div style={{ 
                    padding: '10px', margin: '10px 0 15px', borderRadius: '4px', textAlign: 'center', fontWeight: 700,
                    backgroundColor: message.type === 'success' ? '#d8ead8' : '#f7d7da', // Colores del JSP
                    color: message.type === 'success' ? '#38761d' : '#721c24', // Colores del JSP
                    border: `1px solid ${message.type === 'success' ? '#70a75d' : '#e76c76'}`
                }}>
                    {message.text}
                </div>
            )}
            
            {/* Formulario que maneja el envío */}
            <form onSubmit={handleSubmit}>
                
                {/* Se agrupa el Label y el Input con 'form-group-material' */}
                <div className="form-group-material">
                    <label htmlFor="nombre">Nombre del Material</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Ej. Cemento"
                        required 
                    />
                </div>
                
                <div className="form-group-material">
                    <label htmlFor="cantidad">Cantidad (Stock Inicial)</label>
                    <input 
                        type="number" 
                        id="cantidad" 
                        value={cantidad} 
                        onChange={(e) => setCantidad(e.target.value)} 
                        required 
                        min="0" 
                        step="0.01" 
                        placeholder="0"
                    />
                </div>
                
                <div className="form-group-material">
                    <label htmlFor="unidad">Unidad de Medida</label>
                    <input 
                        type="text" 
                        id="unidad" 
                        value={unidad} 
                        onChange={(e) => setUnidad(e.target.value)} 
                        placeholder="Ej. Bultos"
                        required 
                    />
                </div>
                
                <div className="form-group-material">
                    <label htmlFor="descripcion">Descripción / Detalles</label>
                    {/* Se usa el tag 'textarea' directamente */}
                    <textarea 
                        id="descripcion" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        placeholder="Especificaciones del material."
                        rows="4"
                    />
                </div>
                
                {/* El botón ya no necesita la clase 'boton_regis', el CSS de 'registro-card button' lo estiliza */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Registrar Material'}
                </button>
            </form>
        </div>
    );
}

export default RegistroMaterial;