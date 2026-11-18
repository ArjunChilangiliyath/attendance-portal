
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

import { AppError } from '../utils/app-error.js';

// Handle requests to routes that do not exist
export function notFound(req, _res, next) {
  next(
    new AppError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
}

// Centralized error handler
export function errorHandler(err, _req, res, _next) {
  if (res.headersSent) {
    return res.end();
  }

  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || undefined;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    status = 400;
    message = 'Validation failed';
    details = err.issues;
  }

  // Handle Prisma database errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      status = 409;
      message = 'A record with this value already exists';
    } else if (err.code === 'P2025') {
      status = 404;
      message = 'Record not found';
    } else if (err.code === 'P2003') {
      status = 409;
      message = 'This record is referenced by other records';
    }
  }

  // Log server errors
  if (status >= 500) {
    console.error(err);
  }

  // Send standardized error response
  return res.status(status).json({
    success: false,
    message:
      status >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : message,
    ...(details ? { details } : {}),
  });
}
