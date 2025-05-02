const request = require("supertest"); //utilizada para realizar pruebas HTTP en tus aplicaciones web. Se utiliza comúnmente junto con herramientas como Mocha o Jest
const app = require("../server"); // Ajusta si tu archivo se llama distinto

describe("Flujo completo de citas médicas", () => {
  let pacienteId;
  let medicoId;
  let citaId;

  const pacienteLogin = {
    username: "franco@Gmal.com", // Ajusta según datos reales
    password: "123456",
  };

  const medicoLogin = {
    username: "carlos.garcia@email.com",
    password: "123456",
  };

  it("Login como paciente", async () => {
    const res = await request(app).post("/login").send(pacienteLogin);
    expect(res.statusCode).toBe(200);
    expect(res.body.id_usuario).toBeDefined();
    pacienteId = res.body.id_usuario;
  });

  it("Login como médico", async () => {
    const res = await request(app).post("/login").send(medicoLogin);
    expect(res.statusCode).toBe(200);
    expect(res.body.id_usuario).toBeDefined();
    medicoId = res.body.id_usuario;
  });

  it("Crear cita si el médico está disponible", async () => {
    const cita = {
      id_usuario: pacienteId,
      descripcion: "Dolor de cabeza",
      fecha: "2025-05-05",
      hora: "10:00",
      id_medico: medicoId,
    };

    const res = await request(app).post("/crear-cita").send(cita);
    if (res.statusCode === 400) {
      expect(res.body.message).toMatch(/inactivo/);
    } else {
      expect(res.statusCode).toBe(200);
      expect(res.body.cita).toBeDefined();
      citaId = res.body.cita;
    }
  });

  it("Obtener citas del paciente", async () => {
    const res = await request(app).get(`/citas/${pacienteId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Obtener citas del médico", async () => {
    const res = await request(app).get(`/citas/medico/${medicoId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Reprogramar cita", async () => {
    if (!citaId) return;

    const res = await request(app).put(`/citas/${citaId}`).send({
      nuevaFecha: "2025-05-06",
      nuevaHora: "11:30",
    });

    expect([200, 404]).toContain(res.statusCode);
  });

  it("Agregar observación médica", async () => {
    if (!citaId) return;

    const res = await request(app)
      .put(`/citas/${citaId}/observacion`)
      .send({ observacion_medica: "Paciente estable" });

    expect([200, 404]).toContain(res.statusCode);
  });

  it("Cancelar cita (marcar estado como 'cancelada')", async () => {
    if (!citaId) return;

    const res = await request(app).put(`/citas/cancelar/${citaId}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("Eliminar cita (DELETE)", async () => {
    if (!citaId) return;

    const res = await request(app).delete(`/citas/${citaId}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("Obtener médicos con cantidad de citas", async () => {
    const res = await request(app).get("/medicos-citas");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
