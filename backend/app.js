import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
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
import {UsuarioRepository} from "./src/repositories/users/UsuarioRepository.js";
import {ObraSocialRepository} from "./src/repositories/ObraSocialRepository.js";
import {SedeRepository} from "./src/repositories/SedeRepository.js";

import {PacienteService} from "./src/services/PacienteService.js";
import {TurnoService} from "./src/services/TurnoService.js";
import {AgendaService} from "./src/services/AgendaService.js";
import {MedicoService} from "./src/services/MedicoService.js";
import {ServiciosMedicoService} from "./src/services/ServiciosMedicoService.js";
import {PlanService} from "./src/services/PlanService.js";
import {NotificacionService} from "./src/services/NotificacionService.js";
import {AuthService} from "./src/services/AuthService.js";
import {EspecialidadService} from "./src/services/servicios/EspecialidadService.js";
import {PracticaService} from "./src/services/servicios/PracticaService.js";
import {ObraSocialService} from "./src/services/ObraSocialService.js";
import {SedeService} from "./src/services/SedeService.js";
import {TurnosBatchService} from "./src/services/TurnosBatchService.js";

import {PacienteController} from "./src/controllers/PacienteController.js";
import {TurnoController} from "./src/controllers/TurnoController.js";
import {MedicoController} from "./src/controllers/MedicoController.js";
import {ServiciosMedicoController} from "./src/controllers/ServiciosMedicoController.js";
import {PlanController} from "./src/controllers/PlanController.js";
import {NotificacionController} from "./src/controllers/NotificacionController.js";
import {AuthController} from "./src/controllers/AuthController.js";
import {EspecialidadController} from "./src/controllers/servicios/EspecialidadController.js";
import {PracticaController} from "./src/controllers/servicios/PracticaController.js";
import {ObraSocialController} from "./src/controllers/ObraSocialController.js";
import {SedeController} from "./src/controllers/SedeController.js";
import {AdminController} from "./src/controllers/interno/AdminController.js";


// Acá se arman dependencias, controllers, rutas y middlewares

// App config
const app = express();

// Middlewares
app.use(express.json());

// CORS: credentials:true es necesario para que el browser envie las cookies
// httpOnly (accessToken/refreshToken) desde el frontend Next.js.
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3001",
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS: origin no permitido: " + origin));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());

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
const usuarioRepository = new UsuarioRepository();
const obraSocialRepository = new ObraSocialRepository();
const sedeRepository = new SedeRepository();

// Services
const pacienteService = new PacienteService({pacienteRepository, turnoRepository});
const turnoService = new TurnoService(turnoRepository,pacienteRepository);
const serviciosMedicoService = new ServiciosMedicoService({especialidadRepository, practicaRepository});
const agendaService = new AgendaService({medicoRepository, turnoRepository, especialidadRepository, practicaRepository});
const medicoService = new MedicoService({medicoRepository, turnoRepository, especialidadRepository, practicaRepository, agendaService, sedeRepository});
const planService = new PlanService({planRepository});
const notificacionService = new NotificacionService(notificacionRepository);
const authService = new AuthService(usuarioRepository,pacienteRepository,medicoRepository);
const especialidadService = new EspecialidadService(especialidadRepository);
const practicaService = new PracticaService(practicaRepository);
const obraSocialService = new ObraSocialService(obraSocialRepository, planRepository);
const sedeService = new SedeService(sedeRepository);
const turnosBatchService = new TurnosBatchService({medicoRepository, turnoRepository, especialidadRepository, practicaRepository})

// Controllers
const pacienteController = new PacienteController(pacienteService);
const turnoController = new TurnoController(turnoService);
const serviciosMedicoController = new ServiciosMedicoController(serviciosMedicoService);
const medicoController = new MedicoController(medicoService);
const planController = new PlanController({planService});
const notificacionController = new NotificacionController(notificacionService);
const authController = new AuthController(authService);
const especialidadController = new EspecialidadController(especialidadService);
const practicaController = new PracticaController(practicaService);
const obraSocialController = new ObraSocialController(obraSocialService);
const sedeController = new SedeController(sedeService);
const adminController = new AdminController(turnosBatchService, agendaService);

// Registro de controllers dispo. para las rutas
server.setController(PacienteController, pacienteController);
server.setController(TurnoController, turnoController);
server.setController(ServiciosMedicoController, serviciosMedicoController);
server.setController(MedicoController, medicoController);
server.setController(PlanController, planController);
server.setController(NotificacionController, notificacionController);
server.setController(AuthController, authController);
server.setController(EspecialidadController, especialidadController);
server.setController(PracticaController, practicaController);
server.setController(ObraSocialController, obraSocialController);
server.setController(SedeController, sedeController);
server.setController(AdminController, adminController);

// SWAGGER
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// Registro de rutas principales
server.addRoute(router);

// Configura rutas y middlewares globales
server.configureRoutes();

export default app;
