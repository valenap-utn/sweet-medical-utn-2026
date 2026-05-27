import express from 'express';
import cors from 'cors';
import router from './src/routes/router.js'
import {notFoundHandler} from "./src/middlewares/notFoundHandler.js";
import {errorLogger} from "./src/middlewares/errorLogger.js";
import {errorHandler} from "./src/middlewares/errorHandler.js";

// App config
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api", router);

// + Middlewares
app.use(notFoundHandler) // captura rutas inexistentes

// Error handlers
app. use(errorLogger)  // Loggea errores
app.use(errorHandler) // responde al cliente

export default app;