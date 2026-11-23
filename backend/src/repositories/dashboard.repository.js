
import { prisma } from '../config/database.js';

export const dashboardRepository = {



  // Retrieve dashboard statistics for admin
  admin: async () => {
    const [students, classes, attendance] = await Promise.all([
      // Count active students
      prisma.user.count({
        where: {
          role: 'STUDENT',
          isActive: true,
        },
      }),

      // Count active classes
      prisma.class.count({
        where: {
          isActive: true,
        },
      }),

      // Group all attendance records by status
      prisma.attendance.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
      }),
    ]);

    return {
      students,
      classes,
      attendance: Object.fromEntries(
        attendance.map((item) => [
          item.status,
          item._count._all,
        ])
      ),
    };
  },

  // Retrieve dashboard statistics for a teacher
  teacher: async (teacherId) => {
    // Find the classes assigned to this teacher
    const assignments = await prisma.classTeacher.findMany({
      where: {
        teacherId,
      },
      select: {
        classId: true,
      },
    });

    const classIds = assignments.map(
      (assignment) => assignment.classId
    );

    // Retrieve statistics for the teacher's classes
    const [classes, students, attendance] = await Promise.all([
      // Count active assigned classes
      prisma.class.count({
        where: {
          id: { in: classIds },
          isActive: true,
        },
      }),

      // Count active students in assigned classes
      prisma.user.count({
        where: {
          role: 'STUDENT',
          isActive: true,
          classId: { in: classIds },
        },
      }),

      // Group attendance records by status
      prisma.attendance.groupBy({
        by: ['status'],
        where: {
          classId: { in: classIds },
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    return {
      classes,
      students,
      attendance: Object.fromEntries(
        attendance.map((item) => [
          item.status,
          item._count._all,
        ])
      ),
    };
  },

  // Retrieve dashboard statistics for a student
  student: async (studentId) => {
    const [total, grouped, recent] = await Promise.all([
      // Count total attendance records
      prisma.attendance.count({
        where: {
          studentId,
        },
      }),

      // Group the student's attendance by status
      prisma.attendance.groupBy({
        by: ['status'],
        where: {
          studentId,
        },
        _count: {
          _all: true,
        },
      }),

      // Retrieve the student's seven most recent records
      prisma.attendance.findMany({
        where: {
          studentId,
        },
        orderBy: {
          date: 'desc',
        },
        take: 7,
        select: {
          date: true,
          status: true,
        },
      }),
    ]);

    return {
      total,

      counts: Object.fromEntries(
        grouped.map((item) => [
          item.status,
          item._count._all,
        ])
      ),

      recent,
    };
  },
};
