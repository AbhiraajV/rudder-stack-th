import express from 'express';
import { errorHandler } from './middlewares/error';
import { apiKeyAuth } from './middlewares/api-key';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger'; 
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes'
const app = express();
app.use(express.json());
app.use(errorHandler);

app.use('/public',userRoutes)
app.use('/api', apiKeyAuth);
app.use('/api/events',eventRoutes)








app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
