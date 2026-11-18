
import { userRepository } from '../repositories/user.repository.js';

export const profileService = {
  get: (currentUser) => currentUser,

  update: (userId, input) => {
    const allowedFields = ['firstName', 'lastName', 'phone'];

    const data = Object.fromEntries(
      Object.entries(input).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    return userRepository.update(userId, data);
  }
};
