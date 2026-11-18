
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
app.use(helmet());

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
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// API routes
app.use(env.apiPrefix, routes);

// Handle unknown routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

export default app;
