DROP DATABASE IF EXISTS gma;
CREATE DATABASE gma;
USE gma;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
        contraseña VARCHAR(255) NOT NULL,
        rol ENUM('inspector', 'tecnico') NOT NULL
);

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descripcion TEXT NOT NULL,
        id_tecnico_asignado INT,
        estado ENUM('En Progreso', 'Realizado', 'No Realizado') DEFAULT 'En Progreso',
        para_verificar BOOLEAN DEFAULT 0,
        verificada BOOLEAN DEFAULT 0,
        FOREIGN KEY (id_tecnico_asignado) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Insertar usuarios de prueba

INSERT IGNORE INTO usuarios (id, nombre_usuario, contraseña, rol) VALUES
        (1, 'juanperez', 'contraseña123', 'inspector'),
        (2, 'mariagarcia', 'segura456', 'tecnico'),
        (3, 'carloslopez', 'clave789', 'tecnico');


-- Insertar tareas de prueba
INSERT INTO tareas (descripcion, id_tecnico_asignado, estado, para_verificar, verificada) VALUES
    ('Revisar el sistema de ventilación', 2, 'En Progreso', 0, 0),
    ('Inspeccionar alas', 2, 'En Progreso', 0, 0);

    