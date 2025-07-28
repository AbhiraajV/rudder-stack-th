/// <reference path="../types/express/index.d.ts" />
import { createServer } from 'http';
import config from './config/config';
import { createAppServer } from './server';


createAppServer().listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
