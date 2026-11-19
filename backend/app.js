
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { env } from './src/config/env.js';
import swaggerSpec from './src/config/swagger.js';
import routes from './src/routes/index.js';

import {
  notFound,
  errorHandler
} from './src/middleware/error.middleware.js';

const app = express();

// Security middleware
// Security middleware
app.use(
  helmet({
    crossOriginOpenerPolicy: {
      policy: 'same-origin-allow-popups',
    },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        connectSrc: [
          "'self'",
          'https://dev-qiol7n85fv5k1hy3.us.auth0.com',
        ],
      },
    },
  })
);

app.use('/docs', (_req, res, next) => {
  res.removeHeader('Cross-Origin-Opener-Policy');
  next();
});

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true
  })
);

// Request body parsing
app.use(express.json({ limit: '1mb' }));

app.use(
  express.urlencoded({
    extended: true
  })
);

// HTTP request logging
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })
);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy'
  });
});

// Swagger API documentation

// Swagger OAuth initialization
app.get('/docs/oauth-init.js', (_req, res) => {
  res.type('application/javascript').send(`
    (() => {
      const initializeOAuth = () => {
        if (!window.ui || typeof window.ui.initOAuth !== 'function') {
          return;
        }

        window.ui.initOAuth({
          clientId: ${JSON.stringify(env.auth0ClientId)},
          appName: 'Attendance Portal',
          scopes: 'openid profile email',
          usePkceWithAuthorizationCodeGrant: true,
        });
      };

      if (document.readyState === 'complete') {
        initializeOAuth();
      } else {
        window.addEventListener('load', initializeOAuth, {
          once: true,
        });
      }
    })();
  `);
});

// Swagger API documentation
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      oauth2RedirectUrl:
        `http://localhost:${env.port}/docs/oauth2-redirect.html`,
      persistAuthorization: true,
    },
    customJs: '/docs/oauth-init.js',
  })
);


// API routes
app.use(env.apiPrefix, routes);

// Handle unknown routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

export default app;
