
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);

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


    schemas: {
    StandardSuccessResponse: {
        type: 'object',
        required: ['success', 'message', 'data', 'meta'],
        properties: {
        success: {
            type: 'boolean',
            example: true
        },
        message: {
            type: 'string',
            example: 'Success'
        },
        data: {
            nullable: true,
            oneOf: [
            { type: 'object', additionalProperties: true },
            { type: 'array', items: { type: 'object' } }
            ]
        },
        meta: {
            type: 'object',
            nullable: true,
            additionalProperties: true
        }
        }
    }
    },


    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    resolve(currentDirectory, '../routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
