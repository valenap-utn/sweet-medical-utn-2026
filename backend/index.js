import express from 'express';

const app = express();
app.use(express.json());

app.get("/healthcheck",(req,res)=>{
    res.json({
        "status":"OK"
    });
})

const puerto = 3000;
app.listen(puerto,()=>{
    console.log("El servidor arrancó correctamente en el puerto "+ puerto);
})
