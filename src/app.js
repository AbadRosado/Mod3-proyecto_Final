import 'dotenv/config';
import express from 'express';
import cors from 'cors';    
import 'express-async-errors';
import morgan from 'morgan';
import { loggerMiddleware } from './presentation/middlewares/logger.middleware.js';
import noteRoutes from './presentation/routes/note.routes.js';
import authRoutes from './presentation/routes/auth.routes.js';
//import categoryRoutes from './presentation/routes/category.routes.js';
import { connectMongo } from './infrastructure/database/mongo/connection.js';
import { connectMysql } from './infrastructure/database/mysql/connection.js';
import dns from "node:dns/promises";
import { setupSwagger } from './infrastructure/config/swagger.config.js';

dns.setServers(["1.1.1.1"]); 

await connectMongo();
await connectMysql();
 
const app = express();
 
app.use(cors());
app.use(express.json());
setupSwagger(app);
app.use(loggerMiddleware);
app.use(morgan('dev'));
 
//imagenes estaticas
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
//app.use('/api/v1/categories', categoryRoutes); // Ruta para servir archivos públicos (si es necesario)
 
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK',message: 'API de notas activa' });
});
 
 
 
 
//midleware de manejo de errores global
 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});