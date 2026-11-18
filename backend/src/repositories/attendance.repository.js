
import { prisma } from '../config/database.js';

// Related information included with attendance records
const include = {
  student: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },

  class: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },

  markedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },

  latestChangedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
};

export const attendanceRepository = {
  // Insert or update multiple attendance records
  bulkUpsert: (records) =>
    prisma.$transaction(
      records.map(({ studentId, date, ...data }) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId,
              date,
            },
          },

          create: {
            studentId,
            date,
            ...data,
          },

          update: {
            status: data.status,
            remarks: data.remarks,
            latestChangedById: data.markedById,
            latestChangedAt: new Date(),
          },
        })
      )
    ),

  // Find an attendance record by ID
  find: (id) =>
    prisma.attendance.findUnique({
      where: { id },
      include,
    }),

  // Update an attendance record
  update: (id, data) =>
    prisma.attendance.update({
      where: { id },
      data: {
        ...data,
        latestChangedAt: new Date(),
      },
      include,
    }),

  // Retrieve paginated attendance records and total count
  list: async ({ where, skip, take }) => {
    const [data, total] = await prisma.$transaction([
      prisma.attendance.findMany({
        where,
        include,
        skip,
        take,
        orderBy: {
          date: 'desc',
        },
      }),

      prisma.attendance.count({ where }),
    ]);

    return { data, total };
  },

  // Retrieve attendance history for a student
  historyForStudent: (id) =>
    prisma.attendance.findMany({
      where: {
        studentId: id,
      },
      include,
      orderBy: {
        date: 'desc',
      },
    }),

  // Retrieve attendance history for a class
  historyForClass: (id) =>
    prisma.attendance.findMany({
      where: {
        classId: id,
      },
      include,
      orderBy: {
        date: 'desc',
      },
    }),
};
