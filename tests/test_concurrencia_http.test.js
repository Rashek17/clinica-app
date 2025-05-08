const axios = require("axios");

const URL = "http://localhost:3000/crear-cita";

// Datos de prueba para las citas
const payloads = [
  { id_usuario: 36, descripcion: "Consulta", fecha: "2025-05-08", hora: "10:00:00", id_medico: 1 },
  { id_usuario: 37, descripcion: "Dolor de cabeza", fecha: "2025-05-08", hora: "10:00:00", id_medico: 1 },
  { id_usuario: 38, descripcion: "Chequeo", fecha: "2025-05-08", hora: "10:00:00", id_medico: 1 },
  { id_usuario: 39, descripcion: "Consulta general", fecha: "2025-05-08", hora: "10:00:00", id_medico: 1 },
  { id_usuario: 40, descripcion: "Dolor muscular", fecha: "2025-05-08", hora: "10:00:00", id_medico: 1 },
];

// Función para probar la concurrencia de las peticiones
async function testConcurrencia() {
  try {
    const resultados = await Promise.allSettled(
      payloads.map((payload) =>
        axios.post(URL, payload)
          .then((res) => {
            console.log(`Paciente ${payload.id_usuario}:`, res.data);
            return res.data;
          })
          .catch((err) => {
            console.error(`Paciente ${payload.id_usuario}:`, err.response ? err.response.data : err.message);
            return err.response ? err.response.data : err.message;
          })
      )
    );

    // Imprimir los resultados de todas las peticiones
    resultados.forEach((resultado, index) => {
      console.log(`Resultado para el paciente ${payloads[index].id_usuario}:`, resultado);
    });
  } catch (error) {
    console.error("Error en prueba concurrente:", error);
  }
}

// Ejecutar la función de prueba
testConcurrencia();
