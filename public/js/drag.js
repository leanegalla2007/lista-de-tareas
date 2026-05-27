<script src="list.html">  </script>
// Calcula dinámicamente qué tarjeta está más cerca del puntero del mouse
function obtenerElementoDropPosicion(contenedor, x, y) {
    const tarjetasFijas = [...contenedor.querySelectorAll('.card:not(.dragging)')];

    return tarjetasFijas.reduce((masCercano, hijo) => {
 
      const caja = hijo.getBoundingClientRect();
        
        // Medimos la distancia al centro de cada tarjeta (aplica perfecto para layouts tipo Grid)
        const centroX = caja.left + caja.width / 2;
        const centroY = caja.top + caja.height / 2;
        const distancia = Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2);

        // CORREGIDO: Usamos una propiedad válida sin espacios (distanciaMinima)
        if (distancia < masCercano.distanciaMinima) {
            return { distanciaMinima: distancia, element: hijo };
        } else {
            return masCercano;
        }
    }, { distanciaMinima: Number.POSITIVE_INFINITY }).element;
}

// Lee el nuevo orden visual del DOM y actualiza el array en el LocalStorage
function recalcularNuevoOrden() {
    const contenedor = document.getElementById('contenedor-listas');
    const tarjetasActuales = [...contenedor.querySelectorAll('.card')];
    
    // Reconstruimos el array basándonos en la posición física actual de los elementos
    listas = tarjetasActuales.map(tarjeta => tarjeta.dataset.nombre);
    
    guardarListas();
    
    // Agregamos un ligero timeout de 50ms para que el evento 'click' del 'dragend' 
    // se procese antes de que destruyamos y recreemos el DOM con renderizar()
    setTimeout(() => {
        renderizar();
    }, 50);
}

