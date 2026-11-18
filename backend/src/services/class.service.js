
import { classRepository } from '../repositories/class.repository.js';
import { AppError } from '../utils/app-error.js';

export const classService = {
  list: () => classRepository.list(),

  create: (input) => classRepository.create(input),

  update: async (id, input) => {
    const current = await classRepository.find(id);

    if (!current) {
      throw new AppError(404, 'Class not found');
    }

    return classRepository.update(id, input);
  },

  remove: async (id) => {
    const current = await classRepository.find(id);

    if (!current) {
      throw new AppError(404, 'Class not found');
    }

    // Soft delete: keep the database record, but deactivate it.
    return classRepository.update(id, { isActive: false });
  },

  students: async (id, currentUser) => {
    const klass = await classRepository.find(id);

    if (!klass) {
      throw new AppError(404, 'Class not found');
    }

    if (
      currentUser.role === 'STUDENT' &&
      currentUser.classId !== id
    ) {
      throw new AppError(403, 'You can only view your own class');
    }

    return classRepository.students(id);
  }
};
