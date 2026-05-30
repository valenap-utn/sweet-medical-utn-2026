import express from 'express';
import cors from 'cors';
import router from './src/routes/router.js'
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./src/docs/swagger.js";

import {Server} from "./src/config/Server.js";

import {EspecialidadRepository} from "./src/repositories/EspecialidadRepository.js";
import {PracticaRepository} from "./src/repositories/PracticaRepository.js";
import {PacienteRepository} from "./src/repositories/users/PacienteRepository.js";
import {TurnoRepository} from "./src/repositories/TurnoRepository.js";
import {MedicoRepository} from "./src/repositories/users/MedicoRepository.js";
import {PlanRepository} from "./src/repositories/PlanRepository.js";
import {NotificacionRepository} from "./src/repositories/NotificacionRepository.js";

import {PacienteService} from "./src/services/PacienteService.js";
import {TurnoService} from "./src/services/TurnoService.js";
import {MedicoService} from "./src/services/medicoService.js";
import {ServiciosMedicoService} from "./src/services/ServiciosMedicoService.js";
import {PlanService} from "./src/services/PlanService.js";
import {NotificacionService} from "./src/services/NotificacionService.js";

import {PacienteController} from "./src/controllers/PacienteController.js";
import {TurnoController} from "./src/controllers/TurnoController.js";
import {MedicoController} from "./src/controllers/MedicoController.js";
import {ServiciosMedicoController} from "./src/controllers/ServiciosMedicoController.js";
import {PlanController} from "./src/controllers/PlanController.js";
import {NotificacionController} from "./src/controllers/NotificacionController.js";


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
const medicoRepository = new MedicoRepository();
const especialidadRepository = new EspecialidadRepository();
const practicaRepository = new PracticaRepository();
const planRepository = new PlanRepository();
const notificacionRepository = new NotificacionRepository();

// Services
const pacienteService = new PacienteService({pacienteRepository, turnoRepository});
const turnoService = new TurnoService(turnoRepository,pacienteRepository);
const serviciosMedicoService = new ServiciosMedicoService({especialidadRepository, practicaRepository});
const medicoService = new MedicoService({medicoRepository, turnoRepository, especialidadRepository, practicaRepository});
const planService = new PlanService(planRepository);
const notificacionService = new NotificacionService(notificacionRepository);

// Controllers
const pacienteController = new PacienteController(pacienteService);
const turnoController = new TurnoController(turnoService);
const serviciosMedicoController = new ServiciosMedicoController(serviciosMedicoService);
const medicoController = new MedicoController(medicoService);
const planController = new PlanController(planService);
const notificacionController = new NotificacionController(notificacionService);

// Registro de controllers dispo. para las rutas
server.setController(PacienteController, pacienteController);
server.setController(TurnoController, turnoController);
server.setController(ServiciosMedicoController, serviciosMedicoController);
server.setController(MedicoController, medicoController);
server.setController(PlanController, planController);
server.setController(NotificacionController, notificacionController);

// SWAGGER
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// Registro de rutas principales
server.addRoute(router);

// Configura rutas y middlewares globales
server.configureRoutes();

export default app;