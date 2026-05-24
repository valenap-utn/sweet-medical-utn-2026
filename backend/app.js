import express from 'express';
import cors from 'cors';
import router from './src/routes/router.js'
import {Server} from "./src/config/Server.js";
import {PacienteRepository} from "./src/repositories/PacienteRepository.js";
import {TurnoRepository} from "./src/repositories/TurnoRepository.js";
import {PacienteService} from "./src/services/PacienteService.js";
import {PacienteController} from "./src/controllers/PacienteController.js";

// Acá se arman dependencias, controllers, rutas y middlewares

// App config
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Wrapper de Express
const server = new Server(app);

// Repositories
const pacienteRepository = new PacienteRepository();
const turnoRepository = new TurnoRepository();

// Services
const pacienteService = new PacienteService({pacienteRepository, turnoRepository});

// Controllers
const pacienteController = new PacienteController(pacienteService);

// Registro de controllers dispo. para las rutas
server.setController(PacienteController, pacienteController);

// Registro de rutas principales
server.addRoute(router);

// Configura rutas y middlewares globales
server.configureRoutes();

export default app;