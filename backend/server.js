import app from "./app.js";
import 'dotenv/config';
// import {connectDB} from "./src/config/db.js";

const port = process.env.PORT || 4000;
const host = process.env.HOST;

// await connectDB();

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://${host}:${port}`)
})
