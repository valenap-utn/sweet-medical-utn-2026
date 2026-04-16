import express from 'express';
import 'dotenv/config'
import healthcheckRoute from "./src/routes/healthcheckRoute.js";
import planRoute from "./src/routes/planRoute.js";

// App config
const app = express();
const port = process.env.PORT;


// Middlewares
app.use(express.json());


// API Endpoints
app.use("/api/health",healthcheckRoute);
// app.use("/api/plan", planRoute);

app.listen(port,()=>{
    console.log("El servidor arrancó correctamente en el puerto "+ port);
})
