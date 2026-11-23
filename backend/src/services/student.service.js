import { pagination, pageMeta } from '../utils/pagination.js';
import { userRepository } from '../repositories/user.repository.js';
import { classRepository } from '../repositories/class.repository.js';
import { createAuth0Student } from './auth0.service.js';
import { AppError } from '../utils/app-error.js';

// Keep your existing create() implementation here.
// It should continue creating the Auth0 account first,
// then creating the local student profile.

export const studentService = {
  create: async (input) => {
    const email = input.email.trim().toLowerCase();

    if (await userRepository.findByEmail(email)) {
      throw new AppError(409, 'A user with this email already exists');
    }

    if (
      input.classId &&
      !(await classRepository.find(input.classId))
    ) {
      throw new AppError(404, 'Class not found');
    }

    const auth0User = await createAuth0Student({
      email,
      firstName: input.firstName,
      lastName: input.lastName
    });

    try {
      return await userRepository.create({
        auth0Id: auth0User.user_id,
        email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        role: 'STUDENT',
        classId: input.classId ?? null
      });
    } catch {
      throw new AppError(
        500,
        `Auth0 account ${auth0User.user_id} was created, but the local profile could not be saved`
      );
    }
  },

  list: async (query) => {
    const { page, limit, skip } = pagination(query);

    const result = await userRepository.listStudents({
      skip,
      take: limit,
      search: query.search,
      classId: query.classId,
      isActive: query.isActive === undefined
        ? undefined
        : query.isActive === 'true'
    });

  return {
    students: result.data.map(({ classId, ...student }) => student),
    pagination: pageMeta(result.total, page, limit)
  };
  },


  

  get: async (id) => {
    const user = await userRepository.findById(id);

    if (!user || user.role !== 'STUDENT') {
      throw new AppError(404, 'Student not found');
    }

    return user;
  },

  update: async (id, input) => {
    await studentService.get(id);

    if (
      input.classId &&
      !(await classRepository.find(input.classId))
    ) {
      throw new AppError(404, 'Class not found');
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'classId'
    ];

    const data = Object.fromEntries(
      Object.entries(input).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    return userRepository.update(id, data);
  },

  remove: async (id) => {
    await studentService.get(id);

    return userRepository.update(id, { isActive: false });
  }
};
