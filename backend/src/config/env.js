
import dotenv from 'dotenv';

dotenv.config();

/**
 * Required environment variables.
 * The application cannot start without these values.
 */
const requiredVariables = [
  'DATABASE_URL',
  'AUTH0_DOMAIN',
  'AUTH0_AUDIENCE',
  'AUTH0_ISSUER_BASE_URL',
];

/**
 * Validate required environment variables.
 */
for (const variable of requiredVariables) {
  const value = process.env[variable];

  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

/**
 * Validate environment mode.
 */
const allowedEnvironments = [
  'development',
  'production',
  'test',
];

const nodeEnv = process.env.NODE_ENV || 'development';

if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error(
    `Invalid NODE_ENV: ${nodeEnv}. Allowed values: ${allowedEnvironments.join(', ')}`
  );
}

/**
 * Normalize Auth0 issuer URL.
 */
const auth0IssuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL.trim();

const auth0Issuer = auth0IssuerBaseUrl.endsWith('/')
  ? auth0IssuerBaseUrl
  : `${auth0IssuerBaseUrl}/`;

/**
 * Validate Auth0 URLs.
 */
try {
  new URL(auth0Issuer);
} catch {
  throw new Error('AUTH0_ISSUER_BASE_URL must be a valid URL.');
}

/**
 * CORS configuration.
 */
const corsOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.FRONTEND_URL ||
  'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Centralized application configuration.
 */
export const env = {
  // Application
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  apiPrefix: process.env.API_PREFIX || '/api',

  // Frontend and CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigins,

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Auth0 authentication
  auth0Domain: process.env.AUTH0_DOMAIN.trim(),
  auth0Audience: process.env.AUTH0_AUDIENCE.trim(),
  auth0Issuer,

  // Auth0 application credentials
  auth0ClientId: process.env.AUTH0_CLIENT_ID || null,

  // Auth0 Management API credentials
  auth0M2mClientId: process.env.AUTH0_M2M_CLIENT_ID || null,
  auth0M2mClientSecret: process.env.AUTH0_M2M_CLIENT_SECRET || null,

  // Auth0 database connection
  auth0DbConnection:
    process.env.AUTH0_DB_CONNECTION ||
    'Username-Password-Authentication',
};
