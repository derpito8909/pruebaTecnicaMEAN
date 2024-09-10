/*  archhivo general para el backeend */
// importaciones
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectionMongo from "./config/db.js";

import { empleadoModel } from "./models/empleado.js";
import { departamentoModel } from "./models/departamento.js";

import { createRoutesForModel } from "./routers/router.js";

//  configuracion del servidor
const app = express();
dotenv.config();

// coneccion a la base de datos
connectionMongo();

// llamado al midleware
app.use(express.json());

app.use(cors()); // configura el servidor para que acepte peticiones desde un navegador

createRoutesForModel(empleadoModel, "empleado", app);
createRoutesForModel(departamentoModel, "departamento", app);

//ejecucion de servidor
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`El puerto se esta escuchando en http://localhost:${port}`);
});
