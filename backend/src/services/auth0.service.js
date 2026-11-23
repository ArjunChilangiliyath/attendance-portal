
import { randomBytes } from 'node:crypto';
import axios from 'axios';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

let cachedToken = null;
let expiresAt = 0;

// Obtain and cache Auth0 Management API access token
async function managementToken() {
  if (
    !env.auth0M2mClientId ||
    !env.auth0M2mClientSecret ||
    !env.auth0Domain
  ) {
    throw new AppError(
      500,
      'Auth0 Management API credentials are not configured'
    );
  }

  // Return cached token if it is still valid
  if (cachedToken && Date.now() < expiresAt - 60000) {
    return cachedToken;
  }

  try {
    const { data } = await axios.post(
      `https://${env.auth0Domain}/oauth/token`,
      {
        client_id: env.auth0M2mClientId,
        client_secret: env.auth0M2mClientSecret,
        audience: `https://${env.auth0Domain}/api/v2/`,
        grant_type: 'client_credentials',
      }
    );

    cachedToken = data.access_token;
    expiresAt = Date.now() + data.expires_in * 1000;

    return cachedToken;

  } catch (error) {
    console.error('Auth0 Management Token Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw new AppError(
      502,
      'Unable to obtain Auth0 Management API access token'
    );
  }
}

// Create a student account in Auth0
export async function createAuth0Student({
  email,
  firstName,
  lastName,
}) {
  const token = await managementToken();

  const temporaryPassword =
    `${randomBytes(24).toString('base64url')}aA1!`;

  try {
    const { data } = await axios.post(
      `https://${env.auth0Domain}/api/v2/users`,
      {
        connection: env.auth0DbConnection,
        email,
        password: temporaryPassword,
        name: `${firstName} ${lastName}`,
        given_name: firstName,
        family_name: lastName,
        email_verified: false,
        app_metadata: {
          role: 'STUDENT',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Trigger password reset email
    try {
      await axios.post(
        `https://${env.auth0Domain}/dbconnections/change_password`,
        {
          client_id: env.auth0ClientId,
          email,
          connection: env.auth0DbConnection,
        }
      );

    } catch (error) {
      console.warn(
        'Auth0 account created, but password email could not be triggered:',
        error.response?.data || error.message
      );
    }

    return data;

  } catch (error) {
    console.error('Auth0 Student Creation Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw new AppError(
      error.response?.status === 409 ? 409 : 502,
      error.response?.data?.message ||
        'Unable to create Auth0 student account'
    );
  }
}
