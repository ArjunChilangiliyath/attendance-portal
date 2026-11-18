
import { prisma } from '../config/database.js';

// Common class details included when retrieving users
const include = {
  class: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
};

export const userRepository = {
  // Find a user using their Auth0 ID
  findByAuth0Id: (auth0Id) =>
    prisma.user.findUnique({
      where: { auth0Id },
      include,
    }),

  // Find a user using their database ID
  findById: (id) =>
    prisma.user.findUnique({
      where: { id },
      include,
    }),

  // Find a user using their email
  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email },
    }),

  // Create a new user
  create: (data) =>
    prisma.user.create({
      data,
      include,
    }),

  // Update an existing user
  update: (id, data) =>
    prisma.user.update({
      where: { id },
      data,
      include,
    }),

  // Retrieve students with filtering, searching, and pagination
  listStudents: async ({
    skip,
    take,
    search,
    classId,
    isActive,
  }) => {
    const where = {
      role: 'STUDENT',

      ...(classId ? { classId } : {}),

      ...(isActive === undefined ? {} : { isActive }),

      ...(search
        ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include,
        skip,
        take,
        orderBy: {
          firstName: 'asc',
        },
      }),

      prisma.user.count({ where }),
    ]);

    return { data, total };
  },

  // Retrieve all teachers with their assigned classes
  listTeachers: () =>
    prisma.user.findMany({
      where: {
        role: 'TEACHER',
      },
      include: {
        teacherClasses: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    }),
};
