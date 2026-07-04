import {notFoundHandler} from "../middlewares/notFoundHandler.js";
import {errorLogger} from "../middlewares/errorLogger.js";
import {errorHandler} from "../middlewares/errorHandler.js";

// Esta clase es como un helper para registrar controllers y rutas
export class Server {
    // ---------- Atributos privados ----------

    // Controllers registrados
    #controllers = {};      // diccionario (clave -> valor , permite buscar por nombre/id)

    // Rutas principales registradas
    #routes = [];       // lista

    constructor(app) {
        this.app = app;
    }

    // Guardamos controllers YA instanciados
    setController(controllerClass, controller) {
        this.#controllers[controllerClass.name] = controller;
    }

    // Devuelve un controller a las rutas
    getController(controllerClass) {
        const controller = this.#controllers[controllerClass.name];
        if (!controller) {
            throw new Error(`Controller missing: ${controllerClass.name}`);
        }
        return controller;
    }

    // Registra rutas principales
    addRoute(route) {
        this.#routes.push(route);
    }

    // Configura rutas y middlewares globales
    configureRoutes() {
        this.#routes.forEach(route => {
            this.app.use("/api", route(this.getController.bind(this)));
        });

        // Middleware para manejar ruta inexistente
        this.app.use(notFoundHandler);

        // Middleware para loggear errores
        this.app.use(errorLogger);

        // Middleware para responder al clientes
        this.app.use(errorHandler);
    };
}
