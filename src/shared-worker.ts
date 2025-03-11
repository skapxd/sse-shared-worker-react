// Array para almacenar todos los puertos conectados.
const ports: any[] = [];

// Manejo de la conexión de cada cliente.
// @ts-expect-error: ERR
self.onconnect = function (event: any) {
  const port = event.ports[0];
  ports.push(port);

  // Escuchar mensajes entrantes del cliente (opcional)
  port.onmessage = function (e: any) {
    console.log("Mensaje recibido en el SharedWorker:", e.data);
  };

  // Notificar al cliente que se estableció la conexión.
  port.postMessage("Conexión establecida en SharedWorker");
};

// Intervalo que envía un mensaje recurrente a todos los puertos conectados cada segundo
setInterval(() => {
  const eventData = `Evento recurrente: ${new Date().toLocaleTimeString()}`;
  console.log("Enviando mensaje recurrente:", eventData);
  ports.forEach((port) => port.postMessage(eventData));
}, 1000);

// Ejemplo de conexión SSE dentro del SharedWorker.
const sse = new EventSource("http://localhost:3001/api/sse/1");

sse.onmessage = function (e) {
  // Al recibir un mensaje del servidor, se reenvía a todos los puertos conectados.
  ports.forEach((port) => port.postMessage(e.data));
};

sse.onerror = function (e) {
  console.error("Error en la conexión SSE:", e);
};
