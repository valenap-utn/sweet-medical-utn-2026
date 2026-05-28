import express from 'express';
import cors from 'cors';
import router from './src/routes/router.js'
import {Server} from "./src/config/Server.js";
import {PacienteRepository} from "./src/repositories/users/PacienteRepository.js";
import {TurnoRepository} from "./src/repositories/TurnoRepository.js";
import {PacienteService} from "./src/services/PacienteService.js";
import {PacienteController} from "./src/controllers/PacienteController.js";
import {TurnoService} from "./src/services/TurnoService.js";
import {TurnoController} from "./src/controllers/TurnoController.js";
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./src/docs/swagger.js";
import {ServiciosMedicoService} from "./src/services/ServiciosMedicoService.js";
import {ServiciosMedicoController} from "./src/controllers/ServiciosMedicoController.js";

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
const turnoService = new TurnoService(turnoRepository,pacienteRepository);
const serviciosMedicoService = new ServiciosMedicoService({especialidadRepository, practicaRepository});

// Controllers
const pacienteController = new PacienteController(pacienteService);
const turnoController = new TurnoController(turnoService);
const serviciosMedicoController = new ServiciosMedicoController(serviciosMedicoService);

// Registro de controllers dispo. para las rutas
server.setController(PacienteController, pacienteController);
server.setController(TurnoController, turnoController);
server.setController(ServiciosMedicoController, serviciosMedicoController);

// SWAGGER
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// Registro de rutas principales
server.addRoute(router);

// Configura rutas y middlewares globales
server.configureRoutes();

export default app;