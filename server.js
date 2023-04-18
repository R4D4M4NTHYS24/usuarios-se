// Importar Express y crear una instancia de la aplicación
const express = require("express");
const app = express();

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

// Crear un arreglo vacío para almacenar los usuarios
const usuarios = [];

// Crear una ruta para la página de inicio
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de usuarios");
});

// Crear una ruta para guardar la información de un usuario
app.post("/usuarios", (req, res) => {
  // Obtener la información del usuario desde el cuerpo de la solicitud
  const usuario = req.body;

  // Agregar el usuario al arreglo de usuarios
  usuarios.push(usuario);

  // Enviar una respuesta exitosa al cliente
  res.status(201).json(usuario);
});

// Crear una ruta para obtener la lista de usuarios
app.get("/usuarios", (req, res) => {
  // Enviar la lista de usuarios al cliente
  res.json(usuarios);
});

//Para que lpueda visualizarce a todos los usuarios de la app
app.get("/usuarios", function (req, res) {
  // Leer el archivo JSON de usuarios
  let usuarios = fs.readFileSync("./usuarios.json");
  usuarios = JSON.parse(usuarios);
  // Enviar la lista de usuarios en formato JSON
  res.json(usuarios);
});

// Puerto en el que se ejecutará el servidor
const PORT = 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
