
import { prisma } from '../config/database.js';

const includeCounts = {
  _count: {
    select: {
      students: true,
      teachers: true,
    },
  },
};

export const classRepository = {
  // Retrieve all classes with student and teacher counts
  list: () =>
    prisma.class.findMany({
      orderBy: {
        name: 'asc',
      },
      include: includeCounts,
    }),

  // Find a class by ID with student and teacher counts
  find: (id) =>
    prisma.class.findUnique({
      where: { id },
      include: includeCounts,
    }),

  // Create a new class
  create: (data) =>
    prisma.class.create({
      data,
      include: includeCounts,
    }),

  // Update an existing class
  update: (id, data) =>
    prisma.class.update({
      where: { id },
      data,
      include: includeCounts,
    }),

  // Soft-delete a class by marking it inactive
  delete: (id) =>
    prisma.class.update({
      where: { id },
      data: {
        isActive: false,
      },
    }),

  // Retrieve active students belonging to a class
  students: (id) =>
    prisma.user.findMany({
      where: {
        classId: id,
        role: 'STUDENT',
        isActive: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    }),

  // Retrieve teachers assigned to a class
  teachers: (id) =>
    prisma.classTeacher.findMany({
      where: {
        classId: id,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),
};
