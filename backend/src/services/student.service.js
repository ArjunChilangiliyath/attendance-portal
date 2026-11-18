
import { userRepository } from '../repositories/user.repository.js';
import { classRepository } from '../repositories/class.repository.js';

import { createAuth0Student } from './auth0.service.js';

import { AppError } from '../utils/app-error.js';

export const studentService = {
  async create(input) {
    const email = input.email.trim().toLowerCase();

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        409,
        'A user with this email already exists'
      );
    }

    if (input.classId) {
      const existingClass = await classRepository.find(
        input.classId
      );

      if (!existingClass) {
        throw new AppError(404, 'Class not found');
      }
    }

    const authUser = await createAuth0Student({
      email,
      firstName: input.firstName,
      lastName: input.lastName
    });

    try {
      return await userRepository.create({
        auth0Id: authUser.user_id,
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone || null,
        role: 'STUDENT',
        classId: input.classId || null
      });
    } catch (error) {
      throw new AppError(
        500,
        `Auth0 account was created but database profile creation failed. Reconcile Auth0 user ${authUser.user_id}.`
      );
    }
  }
};
