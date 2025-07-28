/// <reference path="../types/express/index.d.ts" />

import express from 'express';
import { errorHandler } from './middlewares/error';
import { apiKeyAuth } from './middlewares/api-key';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger'; 
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes'
import trackingPlanRoutes from './routes/tracking-plan.routes';
import trackingPlanEventRoutes from './routes/tracking-plan-event.routes';
import propertyRoutes from './routes/property.routes'
import trackingPlanpropertyRoutes from './routes/tracking-plan-property.route'


const app = express();
app.use(express.json());
app.use(errorHandler);

app.use('/public',userRoutes)
app.use('/api', apiKeyAuth);
app.use('/api/tracking-plan',trackingPlanRoutes)
app.use('/api/tracking-plan-events',trackingPlanEventRoutes)
app.use('/api/tracking-plan-event-property',trackingPlanpropertyRoutes)
app.use('/api/events',eventRoutes)
app.use('api/property',propertyRoutes)




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
