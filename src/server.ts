
import express from 'express';
import { errorHandler } from './middlewares/error';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger'; 
import { registerRoutes } from './routes';
export const createAppServer = () => {
    const app = express();
    app.use(express.json());
    app.use(errorHandler);
    app.use(express.json());
    registerRoutes(app);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    return app;

}