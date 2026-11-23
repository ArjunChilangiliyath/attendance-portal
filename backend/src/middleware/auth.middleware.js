
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
import { userRepository } from '../repositories/user.repository.js';

// Create JWKS resolver using Auth0's public keys
const jwks = createRemoteJWKSet(
  new URL(`https://${env.auth0Domain}/.well-known/jwks.json`)
);

// Authentication middleware
export async function authenticate(req, _res, next) {
  // 1. Extract Authorization header
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return next(
      new AppError(401, 'Bearer access token required')
    );
  }

  // 2. Verify Auth0 access token
  let payload;

  try {
    const result = await jwtVerify(
      header.slice(7),
      jwks,
      {
        issuer: env.auth0Issuer,
        audience: env.auth0Audience,
      }
    );

    payload = result.payload;
  } catch {
    return next(
      new AppError(401, 'Invalid or expired access token')
    );
  }

  // 3. Validate Auth0 user identity
  if (typeof payload.sub !== 'string' || !payload.sub) {
    return next(
      new AppError(401, 'Invalid user identity in access token')
    );
  }

  // 4. Find corresponding user in application database
  let user;

  try {
    user = await userRepository.findByAuth0Id(payload.sub);
  } catch (error) {
    return next(error);
  }

  // 5. Ensure user exists and account is active
  if (!user || !user.isActive) {
    return next(
      new AppError(401, 'User account is not active or is not registered')
    );
  }

  // 6. Attach authenticated user information to request
  req.user = user;
  req.auth = payload;

  return next();
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
