import app from "./app.js";
import 'dotenv/config';
import {MongoDBClient} from "./src/config/database.js";

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

// Conectamos con Mongo y levanta HTTP
const start = async () => {
    try {
        await MongoDBClient.connectDB(); // conexión con MongoDB
        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en http://${host}:${port}`)
        })
    } catch (e) {
        console.error("Error iniciando el servidor.", e);
        process.exit(1);
    }
}

start();
