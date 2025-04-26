// Importar las dependencias
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importar CORS

// Crear la aplicación Express
const app = express();
const port = 3000;

// Configurar el middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Habilitar CORS para todas las rutas

// Crear la conexión a MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Usuario de MySQL (por defecto en XAMPP)
  password: "", // Contraseña de MySQL (por defecto vacía en XAMPP)
  database: "clinica_app", // Nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error de conexión a MySQL: " + err.stack);
    return;
  }
  console.log(
    "Conectado a la base de datos MySQL como ID " + connection.threadId
  );
});

//End Poin para login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Consultar la tabla usuarios para verificar el usuario y la contraseña
  const query = "SELECT * FROM usuarios WHERE correo = ?";

  connection.query(query, [username], (err, results) => {
    if (err) {
      res.status(500).send("Error en la consulta");
      return;
    }

    if (results.length > 0) {
      const user = results[0];

      // Verificar el rol y redirigir según el id_rol
      if (user.id_rol === 1 || user.id_rol === 2 || user.id_rol === 3) {
        // Enviar la respuesta con el id_usuario para que se guarde en el frontend
        if (user.id_rol === 1) {
          res.status(200).json({
            message: "Inicio de sesión exitoso paciente",
            redirectUrl: "../view/v-paciente.html",
            id_usuario: user.id_usuario, // Aquí se incluye el id_usuario
          });
        } else if (user.id_rol === 3) {
          res.status(200).json({
            message: "Inicio de sesión exitoso médico",
            redirectUrl: "../view/v-medico.html",
            id_usuario: user.id_usuario, // Aquí se incluye el id_usuario
          });
        } else if (user.id_rol === 2) {
          res.status(200).json({
            message: "Inicio de sesión exitoso administrador",
            redirectUrl: "../view/v-administrador.html",
            id_usuario: user.id_usuario, // Aquí se incluye el id_usuario
          });
        }
      } else {
        res.status(401).json({ message: "Rol no válido" });
      }
    } else {
      // Contraseña incorrecta
      res.status(401).json({ message: "Contraseña incorrecta" });
    }
  });
});
//End pind de crear cita
app.post("/crear-cita", (req, res) => {
  const { id_usuario, descripcion, fecha, hora, id_medico } = req.body;

  if (!id_usuario || !descripcion || !fecha || !hora || !id_medico) {
    return res
      .status(400)
      .json({ message: "Faltan datos para crear la cita." });
  }

  // Verificar si el médico está disponible (Activo)
  const queryDisponibilidad =
    "SELECT disponibilidad FROM medico WHERE id_medico = ?";
  connection.query(queryDisponibilidad, [id_medico], (err, results) => {
    if (err) {
      console.error("Error al verificar disponibilidad del médico:", err);
      return res
        .status(500)
        .json({ message: "Error al verificar disponibilidad del médico." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Médico no encontrado." });
    }

    const disponibilidad = results[0].disponibilidad;

    if (disponibilidad !== "Activo") {
      return res
        .status(400)
        .json({
          message: "El médico está inactivo, no se puede agendar la cita.",
        });
    }

    // Si el médico está activo, proceder a guardar la cita
    const query =
      "INSERT INTO citas (id_usuario, descripcion, fecha, hora, id_medico) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      query,
      [id_usuario, descripcion, fecha, hora, id_medico],
      (err, results) => {
        if (err) {
          console.error("Error al insertar cita:", err);
          return res.status(500).json({ message: "Error al guardar la cita." });
        }

        // Enviar una respuesta con el id de la cita o algún otro dato
        res.status(200).json({
          message: "Cita guardada exitosamente",
          cita: results.insertId,
        });
      }
    );
  });
});

// Obtener citas por id_usuario
app.get("/citas/:id_usuario", (req, res) => {
  const idUsuario = req.params.id_usuario;
  const query = `
SELECT 
  c.id_cita, 
  c.descripcion, 
  c.fecha, 
  c.hora, 
  c.observacion_medica, 
  c.estado,
  u.nombre AS nombre_medico
FROM citas c
LEFT JOIN usuarios u ON c.id_medico = u.id_usuario
WHERE c.id_usuario = ?
ORDER BY c.fecha DESC, c.hora DESC;

  `;

  connection.query(query, [idUsuario], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener las citas" });
    }

    res.status(200).json(results);
  });
});

// Eliminar cita por id_cita
app.delete("/citas/:id_cita", (req, res) => {
  const idCita = req.params.id_cita;
  const query = `DELETE FROM citas WHERE id_cita = ?`;

  connection.query(query, [idCita], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al cancelar la cita" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({ message: "Cita cancelada correctamente" });
  });
});

// Actualizar cita por id_cita (reprogramar)
app.put("/citas/:id_cita", (req, res) => {
  const idCita = req.params.id_cita;
  const { nuevaFecha, nuevaHora } = req.body;

  if (!nuevaFecha || !nuevaHora) {
    return res
      .status(400)
      .json({ message: "Se deben proporcionar nueva fecha y hora" });
  }

  const query = `
    UPDATE citas
    SET fecha = ?, hora = ?
    WHERE id_cita = ?
  `;

  connection.query(query, [nuevaFecha, nuevaHora, idCita], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error al reprogramar la cita" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({ message: "Cita reprogramada correctamente" });
  });
});

// GET /citas/medico/:id_medico
app.get("/citas/medico/:id_medico", (req, res) => {
  const idMedico = req.params.id_medico;

  const query = `
    SELECT 
      citas.*, 
      usuarios.nombre AS nombre_usuario 
    FROM 
      citas 
    JOIN 
      usuarios 
    ON 
      citas.id_usuario = usuarios.id_usuario 
    WHERE 
      citas.id_medico = ? 
    ORDER BY 
      fecha, hora
  `;

  connection.query(query, [idMedico], (err, results) => {
    if (err) {
      console.error("Error al obtener citas:", err);
      return res.status(500).json({ message: "Error al obtener citas" });
    }
    res.status(200).json(results);
  });
});

// PUT /citas/:id_cita/observacion
app.put("/citas/:id_cita/observacion", (req, res) => {
  const idCita = req.params.id_cita;
  const { observacion_medica } = req.body;

  const query = `
    UPDATE citas
    SET observacion_medica = ?
    WHERE id_cita = ?
  `;

  connection.query(query, [observacion_medica, idCita], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al actualizar la observación" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({
      success: true,
      message: "Observación actualizada correctamente",
    });
  });
});

app.put("/citas/cancelar/:id", (req, res) => {
  const idCita = req.params.id;
  const query = `UPDATE citas SET estado = 'cancelada' WHERE id_cita = ?`;

  connection.query(query, [idCita], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al cancelar la cita" });
    }
    res.status(200).json({ message: "Cita cancelada exitosamente" });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
