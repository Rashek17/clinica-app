-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-05-2025 a las 20:03:41
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `clinica-app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `observacion_medica` varchar(100) DEFAULT NULL,
  `id_medico` int(11) DEFAULT NULL,
  `estado` enum('confirmada','cancelada') DEFAULT 'confirmada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `id_usuario`, `descripcion`, `fecha`, `hora`, `observacion_medica`, `id_medico`, `estado`) VALUES
(19, 4, 'Otorrinolaringología', '2025-05-03', '00:38:00', NULL, 12, 'confirmada'),
(22, 4, 'Hematología', '2025-05-02', '06:09:00', 'Prueba de observaciones', 20, 'cancelada'),
(24, 4, 'Medicina general', '2025-05-01', '19:43:00', 'toma medicamntos ', 3, 'cancelada'),
(25, 24, 'Medicina general', '2025-05-01', '13:28:00', 'Tomate los medicamntos chica', 3, 'cancelada'),
(26, 24, 'Odontología', '2025-04-17', '21:27:00', 'Por favor se lo mejor que puedas. No desfallezcas ', 3, 'confirmada'),
(27, 4, 'Traumatología', '2025-04-29', '19:14:00', 'Tomate los medicamentos ', 10, 'cancelada'),
(28, 4, 'Medicina general', '2025-04-30', '10:32:00', NULL, 3, 'confirmada'),
(29, 24, 'Medicina general', '2025-04-29', '19:53:00', 'No se, tomate las pastas \nPor favor ', 3, 'confirmada'),
(30, 24, 'Traumatología', '2025-05-01', '12:09:00', NULL, 10, 'confirmada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `id_medico` int(11) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `disponibilidad` enum('Activo','Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`id_medico`, `especialidad`, `telefono`, `correo`, `disponibilidad`) VALUES
(1, 'Pediatría', '3001234567', 'laura.martinez@clinic.com', 'Activo'),
(3, 'Medicina general', '3101237890', 'juan.perez@clinic.com', 'Activo'),
(4, 'Odontología', '3102222222', 'odontologia@clinic.com', 'Activo'),
(6, 'Cardiología', '3106666666', 'cardiologia@clinic.com', 'Activo'),
(7, 'Dermatología', '3107777656', 'dermatologia@clinic.com', 'Activo'),
(8, 'Neurología', '3108888888', 'neurologia@clinic.com', 'Activo'),
(9, 'Psiquiatría', '3109999999', 'psiquiatria@clinic.com', 'Activo'),
(10, 'Traumatología', '3110000000', 'traumatologia@clinic.com', 'Activo'),
(11, 'Oftalmología', '3111111111', 'oftalmologia@clinic.com', 'Activo'),
(12, 'Otorrinolaringología', '3112222222', 'otorrino@clinic.com', 'Inactivo'),
(13, 'Urología', '3113333333', 'urologia@clinic.com', 'Inactivo'),
(14, 'Endocrinología', '3114444444', 'endocrinologia@clinic.com', 'Activo'),
(15, 'Oncología', '3115555555', 'oncologia@clinic.com', 'Activo'),
(16, 'Gastroenterología', '3116666666', 'gastroenterologia@clinic.com', 'Activo'),
(17, 'Neumología', '3117777777', 'neumologia@clinic.com', 'Activo'),
(18, 'Reumatología', '3118888888', 'reumatologia@clinic.com', 'Activo'),
(19, 'Nefrología', '3119999999', 'nefrologia@clinic.com', 'Inactivo'),
(20, 'Hematología', '3120000000', 'hematologia@clinic.com', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'paciente', 'Rol asignado a los usuarios que buscan atención médica'),
(2, 'administrador', 'Rol encargado de gestionar el sistema y los usuarios'),
(3, 'medico', 'Rol asignado a los usuarios que brindan atención médica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `edad` int(3) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `telefono`, `edad`, `id_rol`) VALUES
(1, 'Juan Perez', 'juan.perez@email.com', '1234567890', 30, 1),
(2, 'Ana Lepez Correas L', 'ana.lopez@email.com', '0987654321', 40, 3),
(3, 'Carlos Garcia', 'carlos.garcia@email.com', '1122334455', 35, 3),
(4, 'Franco', 'franco@Gmal.com', '3004544534', 23, 1),
(5, 'Andres Castano', 'andres@gmail.com', '3001594026', 23, 3),
(6, 'Dr. Javier Martínez', 'javier.martinez@email.com', '3123456789', 40, 3),
(7, 'Dr. María Rodríguez', 'maria.rodriguez@email.com', '3109876543', 38, 3),
(8, 'Dr. Pedro González', 'pedro.gonzalez@email.com', '3112233445', 45, 3),
(9, 'Dr. Laura Sánchez H', 'laura.sanchez@email.com', '3201234567', 32, 3),
(10, 'Dr. Luis Fernández C', 'luis.fernandez@email.com', '3156789876', 50, 3),
(11, 'Dr. Carmen López', 'carmen.lopez@email.com', '3123344556', 28, 3),
(12, 'Dr. Roberto Díaz M', 'roberto.diaz@email.com', '3167876543', 42, 3),
(13, 'Dr. Pilar González', 'pilar.gonzalez@email.com', '3198765432', 36, 3),
(14, 'Dr. Enrique Pérez', 'enrique.perez@email.com', '3142098765', 39, 3),
(15, 'Dr. Ana María Torres', 'ana.torres@email.com', '3176543210', 33, 3),
(16, 'Dr. Julio Herrera', 'julio.herrera@email.com', '3187654321', 47, 3),
(17, 'Dr. Elena Ramírez', 'elena.ramirez@email.com', '3192345678', 40, 3),
(18, 'Dr. José Luis Martín', 'jose.martin@email.com', '3123450123', 41, 3),
(19, 'Dr. Marta Ruiz', 'marta.ruiz@email.com', '3102345678', 34, 3),
(20, 'Dr. Daniel Díaz F', 'daniel.diaz@email.com', '3112233445', 44, 3),
(21, 'Dr. Susana Gómez', 'susana.gomez@email.com', '3209876543', 46, 3),
(22, 'Dr. Alberto Fernández', 'alberto.fernandez@email.com', '3198765431', 48, 3),
(23, 'Admin', 'admin@gmail.com.co', '3001234321', 17, 2),
(24, 'Stefany', 'stefany@gamil.com.co', '320258547', 28, 1),
(25, 'DR Andres Castano', 'casta17@Gmail.com', '3002585476', 22, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `fk_medico` (`id_medico`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`id_medico`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `fk_usuarios_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `medico`
--
ALTER TABLE `medico`
  MODIFY `id_medico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `fk_medico` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id_medico`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
