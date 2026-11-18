
import { prisma } from '../config/database.js';

export const classTeacherRepository = {
  // Assign a teacher to a class
  assign: (teacherId, classId) =>
    prisma.classTeacher.create({
      data: {
        teacherId,
        classId,
      },
    }),

  // Remove a teacher from a class
  remove: (teacherId, classId) =>
    prisma.classTeacher.delete({
      where: {
        teacherId_classId: {
          teacherId,
          classId,
        },
      },
    }),

  // Find a specific teacher-class assignment
  find: (teacherId, classId) =>
    prisma.classTeacher.findUnique({
      where: {
        teacherId_classId: {
          teacherId,
          classId,
        },
      },
    }),

  // Retrieve all classes assigned to a teacher
  classesForTeacher: (teacherId) =>
    prisma.classTeacher.findMany({
      where: {
        teacherId,
      },
      include: {
        class: true,
      },
    }),

  // Retrieve all teachers assigned to a class
  teachersForClass: (classId) =>
    prisma.classTeacher.findMany({
      where: {
        classId,
      },
      include: {
        teacher: true,
      },
    }),
};
