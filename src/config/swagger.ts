
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'A sample API for demonstration purposes',
    },
    servers: [
        {
        url: 'http://localhost:3000/api',
        },
    ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);
export default specs;