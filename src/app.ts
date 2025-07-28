import express from 'express';
import { errorHandler } from './middlewares/error';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger'; // Adjust path as needed



const app = express();
app.use(express.json());

app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
