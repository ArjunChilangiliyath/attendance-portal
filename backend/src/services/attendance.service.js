
import { attendanceRepository } from '../repositories/attendance.repository.js';
import { classRepository } from '../repositories/class.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/app-error.js';
import { pagination, pageMeta } from '../utils/pagination.js';

const dateOnly = (value) => new Date(`${value}T00:00:00.000Z`);

export const attendanceService = {
  bulk: async ({ classId, date, records, markedById }) => {
    const klass = await classRepository.find(classId);

    if (!klass) {
      throw new AppError(404, 'Class not found');
    }

    const studentIds = records.map((record) => record.studentId);

    if (new Set(studentIds).size !== studentIds.length) {
      throw new AppError(400, 'Duplicate student IDs are not allowed');
    }

    for (const record of records) {
      const student = await userRepository.findById(record.studentId);

      if (
        !student ||
        student.role !== 'STUDENT' ||
        student.classId !== classId
      ) {
        throw new AppError(
          400,
          `Student ${record.studentId} does not belong to this class`
        );
      }
    }

    return attendanceRepository.bulkUpsert(
      records.map((record) => ({
        studentId: record.studentId,
        classId,
        date: dateOnly(date),
        status: record.status,
        remarks: record.remarks ?? null,
        markedById
      }))
    );
  },

  list: async (query, currentUser) => {
    const { page, limit, skip } = pagination(query);

    const where = {
      ...(query.classId ? { classId: query.classId } : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.from || query.to
        ? {
            date: {
              ...(query.from
                ? { gte: dateOnly(query.from) }
                : {}),
              ...(query.to
                ? { lte: dateOnly(query.to) }
                : {})
            }
          }
        : {})
    };

    // Students can only view their own attendance.
    if (currentUser.role === 'STUDENT') {
      where.studentId = currentUser.id;
    }

    const result = await attendanceRepository.list({
      where,
      skip,
      take: limit
    });

    return {
      attendance: result.data,
      pagination: pageMeta(result.total, page, limit)
    };
  },

  update: async (id, input, changedById) => {
    const current = await attendanceRepository.find(id);

    if (!current) {
      throw new AppError(404, 'Attendance record not found');
    }

    return attendanceRepository.update(id, {
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.remarks !== undefined ? { remarks: input.remarks } : {}),
      latestChangedById: changedById
    });
  },

  studentHistory: async (studentId, currentUser) => {
    if (
      currentUser.role === 'STUDENT' &&
      currentUser.id !== studentId
    ) {
      throw new AppError(403, 'You can only view your own attendance');
    }

    const student = await userRepository.findById(studentId);

    if (!student || student.role !== 'STUDENT') {
      throw new AppError(404, 'Student not found');
    }

    return attendanceRepository.historyForStudent(studentId);
  },

  classHistory: async (classId, currentUser) => {
    const klass = await classRepository.find(classId);

    if (!klass) {
      throw new AppError(404, 'Class not found');
    }

    if (currentUser.role === 'STUDENT') {
      if (currentUser.classId !== classId) {
        throw new AppError(403, 'You can only view your own class attendance');
      }

      return attendanceRepository.historyForStudent(currentUser.id);
    }

    return attendanceRepository.historyForClass(classId);
  }
};
