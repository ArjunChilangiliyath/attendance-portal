
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { env } from './env.js';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);

// Auth0 authorization endpoint with the custom API audience.
const authorizationUrl = new URL(
  '/authorize',
  `https://${env.auth0Domain}`
);

authorizationUrl.searchParams.set(
  'audience',
  env.auth0Audience
);

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Attendance Portal API',
      version: '1.0.0',
      description: 'API documentation for the Attendance Portal',
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
          type: 'oauth2',
          description: 'Sign in using your Attendance Portal Auth0 account',
          flows: {
            authorizationCode: {
              authorizationUrl: authorizationUrl.toString(),
              tokenUrl: `https://${env.auth0Domain}/oauth/token`,
              scopes: {
                openid: 'OpenID authentication',
                profile: 'Access basic profile information',
                email: 'Access email information',
              },
            },
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
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success',
            },
            data: {
              nullable: true,
              oneOf: [
                {
                  type: 'object',
                  additionalProperties: true,
                },
                {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              ],
            },
            meta: {
              type: 'object',
              nullable: true,
              additionalProperties: true,
            },
          },
        },
      },
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
