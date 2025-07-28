import { Express } from 'express';
import userRoutes from './user.routes';
import trackingPlanRoutes from './tracking-plan.routes';
import trackingPlanEventRoutes from './tracking-plan-event.routes';
import trackingPlanpropertyRoutes from './tracking-plan-property.route'
import eventRoutes from './event.routes';
import propertyRoutes from './property.routes';
import { apiKeyAuth } from '../middlewares/api-key';

export const registerRoutes = (app: Express) => {
  app.use('/public', userRoutes);
  app.use('/api', apiKeyAuth);
  app.use('/api/tracking-plan', trackingPlanRoutes);
  app.use('/api/tracking-plan-events', trackingPlanEventRoutes);
  app.use('/api/tracking-plan-event-property', trackingPlanpropertyRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/property', propertyRoutes);
};
