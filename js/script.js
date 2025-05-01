let prism = document.querySelector(".rec-prism");

function showSignup() {
  prism.style.transform = "translateZ(-100px) rotateY( -90deg)";
}
function showForgotPassword() {
  prism.style.transform = "translateZ(-100px) rotateY( -180deg)";
}

function showLogin() {
  prism.style.transform = "translateZ(-100px)";
}

function showSubscribe() {
  prism.style.transform = "translateZ(-100px) rotateX( -90deg)";
}

function showContactUs() {
  prism.style.transform = "translateZ(-100px) rotateY( 90deg)";
}

function showThankYou() {
  prism.style.transform = "translateZ(-100px) rotateX( 90deg)";
}

function login() {
  const username = document.getElementById("txtUsuario").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (
        data.message === "Inicio de sesión exitoso paciente" ||
        data.message === "Inicio de sesión exitoso médico" ||
        data.message === "Inicio de sesión exitoso administrador"
      ) {
        // Guardar el id_usuario en el localStorage
        if (data.id_usuario) {
          localStorage.setItem("id_usuario_login", data.id_usuario);
        }

        // Redirigir según el rol
        window.location.href = data.redirectUrl; // Redirige a la URL correspondiente
      } else {
        // Mostrar el mensaje de error
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al iniciar sesión");
    });
}

function guardarCita() {
  const selectDescripcion = document.getElementById("descripcion");
  const id_medico = selectDescripcion.value;
  const descripcion =
    selectDescripcion.options[selectDescripcion.selectedIndex].text;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const id_usuario = localStorage.getItem("id_usuario_login");

  if (!descripcion || !fecha || !hora || !id_usuario || !id_medico) {
    alert("Por favor completa todos los campos.");
    return;
  }

  console.log("Descripción:", descripcion);
  console.log("Fecha:", fecha);
  console.log("Hora:", hora);
  console.log("ID Usuario:", id_usuario);
  console.log("ID Médico:", id_medico);

  // Realizar la petición al backend
  fetch("http://localhost:3000/crear-cita", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, descripcion, fecha, hora, id_medico }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Verifica si el médico está inactivo
      if (
        data.message === "El médico está inactivo, no se puede agendar la cita."
      ) {
        alert(data.message); // Mostrar mensaje específico de error
        return; // Terminar la función si el médico está inactivo
      }

      // Si la cita se guarda exitosamente
      alert("Cita guardada exitosamente.");
      obtenerCitasUsuario(); // Obtener las citas del usuario
      console.log(data);
    })
    .catch((error) => {
      console.error("Error al guardar la cita:", error);
      alert("Hubo un error al guardar la cita.");
    });
}

function obtenerCitasUsuario() {
  const idUsuario = localStorage.getItem("id_usuario_login");

  if (!idUsuario) {
    alert("No se encontró el usuario. Por favor, inicie sesión nuevamente.");
    window.location.href = "../index.html";
    return;
  }

  fetch(`http://localhost:3000/citas/${idUsuario}`)
    .then((response) => response.json())
    .then((citas) => {
      const container = document.querySelector(".transfers");
      container.innerHTML = "";

      citas.forEach((cita) => {
        const fechaFormateada = new Date(cita.fecha).toLocaleDateString(
          "es-CO"
        );
        const hora = cita.hora.slice(0, 5); // formato HH:MM

        // Elegimos un ícono según la descripción (puedes personalizar)
        const iconMap = {
          "Medicina general": "apple",
          Odontología: "apple",
          Psicología: "apple",
          Nutrición: "apple",
          "Consulta de control": "apple",
          Ginecología: "apple",
        };
        const icon = iconMap[cita.descripcion] || "calendar";

        const citaHtml = `
          <div class="transfer ${
            cita.estado === "cancelada" ? "cancelada" : ""
          }" data-id="${cita.id_cita}">
            <div class="transfer-logo">
              <!-- <img src="icono.png" alt="icono" style="height: 40px;"> -->
            </div>

            <div class="transfer-details-row">
              <div class="transfer-column">
                <dt>${cita.descripcion}</dt>
                <dd>${hora} hrs</dd>
              </div>
              <div class="transfer-column">
                <dt>${fechaFormateada}</dt>
                <dd>Fecha</dd>
              </div>
              <div class="transfer-column">
                <dt>Médico</dt>
                <dd>${cita.nombre_medico}</dd>
              </div>
              <div class="transfer-column">
                <dt>Observación médica</dt>
                <dd>${cita.observacion_medica || "Sin observaciones"}</dd>
              </div>
              <div class="transfer-column">
                <dt>Estado</dt>
                <dd><strong>${cita.estado}</strong></dd>
              </div>
            </div>

            <div class="actions">
              ${
                cita.estado === "cancelada"
                  ? ""
                  : `
                <button class="reprogramar-btn flat-button" data-id="${cita.id_cita}">Reprogramar</button>
                <button class="cancelar-btn flat-button red" data-id="${cita.id_cita}">Cancelar</button>
              `
              }
            </div>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", citaHtml);
      });

      // Eventos para botones reprogramar
      document.querySelectorAll(".reprogramar-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const citaId = event.target.getAttribute("data-id");
          mostrarFormularioReprogramacion(citaId);
        });
      });

      // Eventos para botones cancelar
      document.querySelectorAll(".cancelar-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const citaId = event.target.getAttribute("data-id");
          cancelarCita(citaId);
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar citas:", error);
    });
}

// Función para mostrar el formulario de reprogramación
function mostrarFormularioReprogramacion(citaId) {
  // Mostrar el formulario
  const form = document.getElementById("popup-overlay");
  form.style.display = "block";

  // Agregar evento al botón de confirmar
  document
    .getElementById("confirmarReprogramacion")
    .addEventListener("click", () => {
      const nuevaFecha = document.getElementById("nuevaFecha").value;
      const nuevaHora = document.getElementById("nuevaHora").value;

      if (!nuevaFecha || !nuevaHora) {
        alert("Por favor, ingrese una nueva fecha y hora.");
        return;
      }

      // Llamada a la función para reprogramar la cita
      reprogramarCita(citaId, nuevaFecha, nuevaHora);
    });

  // Agregar evento al botón de cancelar
  document
    .getElementById("cancelarReprogramacion")
    .addEventListener("click", () => {
      form.style.display = "none"; // Ocultar formulario de reprogramación
    });
}

// Función para reprogramar una cita (actualizarla)
function reprogramarCita(citaId, nuevaFecha, nuevaHora) {
  // Hacer la solicitud PUT para actualizar la cita
  fetch(`http://localhost:3000/citas/${citaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nuevaFecha: nuevaFecha,
      nuevaHora: nuevaHora,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Cita reprogramada", data);
      alert("Cita reprogramada correctamente");
      document.getElementById('popup-overlay').style.display = 'none';
      // Recargar las citas después de la actualización
      obtenerCitasUsuario();
      // Ocultar formulario de reprogramación
      document.getElementById("reprogramar-form").style.display = "none";
    })
    .catch((error) => {
      console.error("Error al reprogramar cita:", error);
      alert("Hubo un error al reprogramar la cita.");
    });
}

// Función para cancelar una cita (eliminarla)
function cancelarCita(citaId) {
  // Aquí puedes agregar el código para cancelar (eliminar) la cita
  console.log(`Cancelando la cita con ID: ${citaId}`);
  // Ejemplo de solicitud DELETE para eliminar la cita
  fetch(`http://localhost:3000/citas/${citaId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Cita cancelada", data);
      alert("Cita cancelada correctamente");
      // Recargar las citas después de la eliminación
      obtenerCitasUsuario();
    })
    .catch((error) => {
      console.error("Error al cancelar cita:", error);
      alert("Hubo un error al cancelar la cita.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const idUsuario = localStorage.getItem("id_usuario_login");

  if (!idUsuario) {
    const yaMostroAlerta = localStorage.getItem("login_check");

    if (!yaMostroAlerta) {
      alert("No se encontró el usuario. Por favor, inicie sesión nuevamente.");
      localStorage.setItem("login_check", "true");
      window.location.href = "../index.html";
    }
  } else {
    localStorage.removeItem("login_check");
    obtenerCitasUsuario();
  }
  cargarMedicosAdmin();
  cargarUsuarios();
  cargarCitas();

  document.getElementById('inputState').addEventListener('change', function () {
    var especialidadGroup = document.getElementById('especialidadGroup');
    if (this.value === '3') { // 3 es Medico
      especialidadGroup.style.display = 'block';
    } else {
      especialidadGroup.style.display = 'none';
    }
  });
});


function alternarCitas() {
  const citasContainer = document.getElementById("citas-medico");
  const verCitasButton = document.getElementById("ver-citas");

  const estaVisible = !citasContainer.classList.contains("d-none");

  if (estaVisible) {
    citasContainer.classList.add("d-none");
    verCitasButton.textContent = "Ver";
    return;
  }

  obtenerCitasMedico();
  verCitasButton.textContent = "Ocultar";
}

function obtenerCitasMedico() {
  const idMedico = localStorage.getItem("id_usuario_login");
  const citasContainer = document.getElementById("citas-medico");

  fetch(`http://localhost:3000/citas/medico/${idMedico}`)
    .then((response) => response.json())
    .then((citas) => {
      citasContainer.innerHTML = "";

      if (citas.length === 0) {
        citasContainer.innerHTML = "<div class='col-12'><p>No hay citas registradas</p></div>";
      } else {
        citas.forEach((cita) => {
          const estaCancelada = cita.estado === "cancelada";
          const citaHTML = `
            <div class="col-12 col-sm-6 col-md-4">
              <div class="card ${estaCancelada ? "bg-light text-muted border-secondary" : ""}">
                <div class="card-body">
                  <h5 class="card-title">${cita.descripcion}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">${new Date(
                    cita.fecha
                  ).toLocaleDateString()} - ${cita.hora} hrs</h6>
                  <p class="card-text"><strong>Paciente:</strong> ${cita.nombre_usuario}</p>
                  <p class="card-text"><strong>Observación:</strong></p>
                  <textarea class="form-control mb-2" id="observacion-${cita.id_cita}" ${estaCancelada ? "disabled" : ""}>${
            cita.observacion_medica || ""
          }</textarea>
                  ${
                    estaCancelada
                      ? '<div class="text-danger fw-bold">Cita cancelada</div>'
                      : ""
                  }
                  <button class="btn btn-success btn-sm guardar-observacion-btn me-2 mt-2" data-id="${cita.id_cita}" ${
            estaCancelada ? "disabled" : ""
          }>Guardar Observación</button>
                  <button class="btn btn-danger btn-sm mt-2" id="btnCancelarCita-${cita.id_cita}" data-id="${cita.id_cita}" ${
            estaCancelada ? "disabled" : ""
          }>Cancelar Cita</button>
                </div>
              </div>
            </div>
          `;
          citasContainer.innerHTML += citaHTML;
        });

        // Agregar eventos a los botones
        document.querySelectorAll(".guardar-observacion-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            guardarObservacion(this.dataset.id);
          });
        });

        document.querySelectorAll("[id^='btnCancelarCita-']").forEach((btn) => {
          btn.addEventListener("click", function () {
            cancelarCitaMedico(this.dataset.id);
          });
        });
      }

      citasContainer.classList.remove("d-none");
    })
    .catch((error) => {
      console.error("Error al cargar citas:", error);
      citasContainer.innerHTML = "<div class='col-12'><p>Error al cargar citas</p></div>";
      citasContainer.classList.remove("d-none");
    });
}


// Función para guardar la observación
function guardarObservacion(idCita) {
  const observacionTextArea = document.getElementById(`observacion-${idCita}`);
  const nuevaObservacion = observacionTextArea.value; // Obtenemos el valor del textarea

  // Realizamos la solicitud PUT para guardar la observación
  fetch(`http://localhost:3000/citas/${idCita}/observacion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      observacion_medica: nuevaObservacion,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Observación guardada correctamente");
      } else {
        alert("Error al guardar la observación");
      }
    })
    .catch((error) => {
      console.error("Error al guardar observación:", error);
      alert("Hubo un error al guardar la observación");
    });
}
function cancelarCitaMedico(idCita) {
  const btnCancelar = document.getElementById(`btnCancelarCita-${idCita}`);

  if (!btnCancelar) return;

  btnCancelar.addEventListener("click", () => {
    fetch(`http://localhost:3000/citas/cancelar/${idCita}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: "cancelada" }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cancelar la cita.");
        return response.json();
      })
      .then(() => {
        alert("Cita cancelada correctamente.");
        btnCancelar.textContent = "Cancelada";
        btnCancelar.disabled = true;
        btnCancelar.style.backgroundColor = "#ccc";
      })
      .catch((error) => {
        console.error("Error al cancelar cita:", error);
        alert("Hubo un error al cancelar la cita.");
      });
  });
}

function cargarMedicosAdmin() {
  fetch("http://localhost:3000/medicos-citas")
    .then((response) => response.json()) // Convierte la respuesta a JSON
    .then((data) => {
      const tbody = document.querySelector("#tblMedico tbody"); // Seleccionamos el tbody de la tabla
      tbody.innerHTML = ""; // Limpia el contenido inicial

      data.forEach((medico) => {
        const tr = document.createElement("tr");

        // Para la columna 'disponibilidad', usamos un select
        const disponibilidadSelect = `
          <select data-field="disponibilidad">
            <option value="Activo" ${
              medico.disponibilidad === "Activo" ? "selected" : ""
            }>Activo</option>
            <option value="Inactivo" ${
              medico.disponibilidad === "Inactivo" ? "selected" : ""
            }>Inactivo</option>
          </select>
        `;

        tr.innerHTML = `
            <td contenteditable="true" data-field="nombre_medico">${medico.nombre_medico}</td>
            <td contenteditable="true" data-field="especialidad">${medico.especialidad}</td>
            <td contenteditable="true" data-field="cantidad_citas">${medico.telefono}</td>
            <td contenteditable="true" data-field="telefono">${medico.telefono}</td>
            <td>${disponibilidadSelect}</td>
            <td><button class="btn btn-danger" onclick="eliminarMedico(${medico.id_medico})">Eliminar</button></td>
        `;

        tbody.appendChild(tr);

        // Hacer que los datos modificados se guarden en la base de datos para los campos contenteditable
        tr.addEventListener(
          "blur",
          function (event) {
            if (event.target.dataset.field !== "disponibilidad") {
              const updatedField = event.target.dataset.field;
              const newValue = event.target.textContent;

              if (newValue !== medico[updatedField]) {
                actualizarMedico(medico.id_medico, updatedField, newValue);
              }
            }
          },
          true
        );

        // Manejo del cambio en el select de disponibilidad
        const select = tr.querySelector('select[data-field="disponibilidad"]');
        select.addEventListener("change", function () {
          const newValue = select.value;
          if (newValue !== medico.disponibilidad) {
            alert(
              `Disponibilidad de ${medico.nombre_medico} actualizada a: ${newValue}`
            );
            actualizarMedico(medico.id_medico, "disponibilidad", newValue);
          }
        });
      });
    })
    .catch((error) => console.log("Error cargando médicos:", error)); // Manejo de errores
}

// Función para actualizar un médico en la base de datos
function actualizarMedico(idMedico, field, newValue) {
  fetch(`http://localhost:3000/medico/${idMedico}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      field: field,
      newValue: newValue,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Médico actualizado:", data);
    })
    .catch((error) => {
      console.error("Error al actualizar médico:", error);
    });
}

// Función para eliminar un médico
function eliminarMedico(idMedico) {
  fetch(`http://localhost:3000/medico/${idMedico}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Médico eliminado:", data);
      cargarMedicosAdmin(); // Vuelve a cargar la lista de médicos
    })
    .catch((error) => {
      console.error("Error al eliminar médico:", error);
    });
}

function cargarCitas() {
  fetch("http://localhost:3000/citas")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener las citas");
      }
      return response.json();
    })
    .then((citas) => {
      const tbody = document.querySelector("#tblCitasAdmin tbody");
      tbody.innerHTML = ""; // Limpiar tabla antes de cargar nueva información

      // Verificar que la respuesta tenga datos
      console.log(citas); // Esto te ayudará a verificar qué datos estás recibiendo

      citas.forEach((cita) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${cita.nombre_medico}</td>
          <td>${cita.especialidad}</td>
          <td>${cita.dia_cita}</td>
          <td>${cita.total_citas}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error(error);
      console.log(
        "No se pudieron cargar las citas. Vista no habilitada para mostrar todas las citas",
        error
      );
    });
}

function cargarUsuarios() {
  fetch("http://localhost:3000/pacientes")
    .then((response) => response.json())
    .then((usuarios) => {
      const tbody = document.querySelector("#modalPacientes table tbody");
      tbody.innerHTML = ""; // Limpiar la tabla antes de cargar nueva información

      usuarios.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${usuario.nombre}</td>
          <td>${usuario.correo}</td>
          <td>${usuario.telefono}</td>
          <td>${usuario.edad}</td>
          <td>${usuario.rol}</td>
          <td><button class="btn btn-danger" onclick="verCitas(${usuario.id_usuario})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error(error);
      console.log(
        "No se pudieron cargar los usuarios. La vista no esta habilitada para mostrar usuarios",
        error
      );
    });
}

function crearUsuarioAdmin(event) {
  event.preventDefault();

  const nombre = document.getElementById("txtNombreA").value.trim();
  const correo = document.getElementById("txtCorreoA").value.trim();
  const telefono = document.getElementById("txtTelefonoA").value.trim();
  const edad = document.getElementById("txtEdadA").value.trim();
  const id_rol = document.getElementById("inputState").value;
  const especialidad = document.getElementById("txtEspecialidadA").value.trim(); // Nuevo

  if (!nombre || !correo || !telefono || !edad || !id_rol) {
    alert("Todos los campos son obligatorios");
    return;
  }

  // Preparar datos
  const data = {
    nombre,
    correo,
    telefono,
    edad: parseInt(edad),
    id_rol: parseInt(id_rol),
  };

  // Si el rol es Médico, agregar la especialidad
  if (parseInt(id_rol) === 3) {
    if (!especialidad) {
      alert("Debe ingresar la especialidad del médico");
      return;
    }
    data.especialidad = especialidad;
  }

  fetch("http://localhost:3000/crear-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const result = await response.json();
      if (response.ok) {
        alert("Usuario creado exitosamente");
        document.querySelector("#formModal form").reset();
        $("#formModal").modal("hide");
      } else {
        alert("Error: " + result.message);
      }
    })
    .catch((error) => {
      alert("Error en la conexión: " + error.message);
    });
}

