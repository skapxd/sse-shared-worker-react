import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Crea la instancia del SharedWorker. Asegúrate de que la ruta sea correcta.
    // const worker = new SharedWorker("./shared-worker.ts");
    const worker = new SharedWorker(new URL('./shared-worker.ts', import.meta.url), {
      type: 'module'
    })

    // Iniciar el puerto de comunicación
    worker.port.start();

    // Configurar el listener para recibir mensajes del worker
    worker.port.onmessage = (e) => {
      console.log("Mensaje recibido desde el SharedWorker:", e.data);
      // @ts-expect-error: ERR
      setMessages((prev) => [...prev, e.data]);
    };

    // (Opcional) Enviar un mensaje al worker
    worker.port.postMessage("Hola desde React");

    // Limpieza al desmontar el componente
    return () => {
      worker.port.close();
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Mensajes del SharedWorker</h1>
      {messages.map((msg, idx) => (
        <p key={idx}>{msg}</p>
      ))}
    </div>
  );
}

export default App;