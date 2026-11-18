
import swaggerJsdoc from 'swagger-jsdoc';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Class Management API',
      version: '1.0.0',
      description: 'API documentation for the Class Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Auth0 access token',
        },
      },
    },
  },
  apis: ['./app/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
