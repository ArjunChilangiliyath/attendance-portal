
import { attendanceRepository } from '../repositories/attendance.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { classRepository } from '../repositories/class.repository.js';

import { AppError } from '../utils/app-error.js';

const summarize = (rows) => {
  const counts = {
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    EXCUSED: 0
  };

  rows.forEach((row) => {
    counts[row.status]++;
  });

  const total = rows.length;

  return {
    total,
    counts,
    attendancePercentage: total
      ? Number(
          (
            ((counts.PRESENT + counts.LATE) / total) *
            100
          ).toFixed(2)
        )
      : 0
  };
};

export const reportService = {
  async student(id) {
    const user = await userRepository.findById(id);

    if (!user || user.role !== 'STUDENT') {
      throw new AppError(404, 'Student not found');
    }

    const rows = await attendanceRepository.historyForStudent(id);

    return {
      student: user,
      summary: summarize(rows),
      attendance: rows
    };
  },

  async class(id) {
    const klass = await classRepository.find(id);

    if (!klass) {
      throw new AppError(404, 'Class not found');
    }

    const rows = await attendanceRepository.historyForClass(id);

    return {
      class: klass,
      summary: summarize(rows),
      attendance: rows
    };
  },

  summarize
};
