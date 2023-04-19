const sqlstring = require("sqlstring");

// Importar Express y crear una instancia de la aplicación
const express = require("express");
const app = express();

/////////////////////////proteccion sql inyection//////////////////////////

function addUser(req, res) {
  const name = req.body.name;
  const id = req.body.id;
  const phone = req.body.phone;

  // Validar los datos ingresados por el usuario
  if (!name || !id || !phone) {
    return res.status(400).send("Faltan campos obligatorios");
  }

  // Escapar los datos para evitar la inyección de código malicioso
  const nameEscaped = sqlstring.escape(name);
  const idEscaped = sqlstring.escape(id);
  const phoneEscaped = sqlstring.escape(phone);

  // Crear la consulta SQL
  const query = `INSERT INTO users (name, id, phone) VALUES (${nameEscaped}, ${idEscaped}, ${phoneEscaped})`;

  // Ejecutar la consulta en la base de datos
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al guardar el usuario");
    }

    console.log(`Se ha guardado el usuario ${name} en la base de datos`);
    res.status(201).send("Usuario guardado correctamente");
  });
}

const cors = require("cors");
app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Middleware para permitir solicitudes CORS desde el dominio del frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  //res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  next();
});

// Crear un arreglo vacío para almacenar los usuarios en memoria
const usuariosEnMemoria = [];

// Crear una ruta para la página de inicio
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de usuarios");
});

// Crear una ruta para guardar la información de un usuario en memoria
app.post("/usuariosEnMemoria", (req, res) => {
  // Obtener la información del usuario desde el cuerpo de la solicitud
  const usuario = req.body;

  // Agregar el usuario al arreglo de usuarios en memoria
  usuariosEnMemoria.push(usuario);

  // Enviar una respuesta exitosa al cliente
  res.status(201).json(usuario);
});

// Crear una ruta para obtener la lista de usuarios en memoria
app.get("/usuariosEnMemoria", (req, res) => {
  // Enviar la lista de usuarios en memoria al cliente
  res.json(usuariosEnMemoria);
});

// Crear una ruta para obtener la lista de usuarios en disco
const fs = require("fs");

app.get("/usuariosEnDisco", async (req, res) => {
  try {
    // Leer el archivo JSON de usuarios
    const usuariosEnDisco = await fs.promises.readFile("./usuarios.json");

    // Convertir los datos del archivo en un objeto JavaScript
    const usuariosEnDiscoObjeto = JSON.parse(usuariosEnDisco);

    // Enviar la lista de usuarios en disco al cliente
    res.json(usuariosEnDiscoObjeto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al leer el archivo de usuarios");
  }
});

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
