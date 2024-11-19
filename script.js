if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((reg) => console.log("Registro de SW exitoso ", reg))
    .catch((err) => console.error("Error al tratar de registrar el SW ", err));
} else {
  console.log("no hay serviceWorker");
}


// Escuchar mensajes enviados desde el iframe
window.addEventListener('message', async (event) => {
  // Verificar si el mensaje es válido y contiene el tipo esperado
  if (event.data && event.data.type === 'SHARE_CONTENT') {
    const { title, text, url } = event.data.payload;

    try {
      // Intentar compartir usando la API de Web Share
      if (navigator.share) {
        await navigator.share({ title, text, url });
        console.log('Contenido compartido exitosamente.');
        // Enviar confirmación al iframe
        event.source.postMessage({ type: 'SHARE_SUCCESS' }, event.origin);
      } else {
        console.warn('API de compartir no soportada.');
        // Notificar al iframe que la API no está disponible
        event.source.postMessage({ type: 'SHARE_UNSUPPORTED' }, event.origin);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      // Enviar error al iframe
      event.source.postMessage({ type: 'SHARE_ERROR', error: error.message }, event.origin);
    }
  }
});
