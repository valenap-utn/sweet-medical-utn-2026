import express from 'express';
import cors from 'cors';
import router from './src/routes/router.js'

// App config
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use("/api", router);

export default app;