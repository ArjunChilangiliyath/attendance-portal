
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
import { userRepository } from '../repositories/user.repository.js';

// Create JWKS resolver using Auth0's public keys
const jwks = createRemoteJWKSet(
  new URL(
    `https://${env.auth0Domain}/.well-known/jwks.json`
  )
);

// Authentication middleware
export async function authenticate(req, _res, next) {
  try {
    // Extract Authorization header
    const header = req.headers.authorization || '';

    // Ensure Bearer token is provided
    if (!header.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'Bearer access token required'
      );
    }

    // Verify JWT access token
    const { payload } = await jwtVerify(
      header.slice(7),
      jwks,
      {
        issuer: env.auth0Issuer,
        audience: env.auth0Audience,
      }
    );

    // Find corresponding user in application database
    const user = await userRepository.findByAuth0Id(
      payload.sub
    );

    // Ensure user exists and account is active
    if (!user || !user.isActive) {
      throw new AppError(
        401,
        'User account is not active or is not registered'
      );
    }

    // Attach authenticated user information to request
    req.user = user;
    req.auth = payload;

    return next();

  } catch (error) {
    return next(
      error instanceof AppError
        ? error
        : new AppError(
            401,
            'Invalid or expired access token'
          )
    );
  }
}

// Role-based authorization middleware
export const allowRoles = (...roles) => {
  return (req, _res, next) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }

    return next(
      new AppError(
        403,
        'You do not have permission to perform this action'
      )
    );
  };
};

// Reusable teacher-only middleware
export const teacherOnly = allowRoles('TEACHER');

// Reusable student-only middleware
export const studentOnly = allowRoles('STUDENT');
