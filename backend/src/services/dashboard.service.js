
import { dashboardRepository } from '../repositories/dashboard.repository.js';

export const dashboardService = {
  admin: async () => {
    const result = await dashboardRepository.admin();
    const counts = result.attendance;

    const total = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      students: result.students,
      classes: result.classes,
      attendance: {
        total,
        present: counts.PRESENT ?? 0,
        absent: counts.ABSENT ?? 0,
        late: counts.LATE ?? 0,
        excused: counts.EXCUSED ?? 0
      }
    };
  },

  student: async (studentId) => {
    const result = await dashboardRepository.student(studentId);
    const counts = result.counts;

    const total = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    const attended = (counts.PRESENT ?? 0) + (counts.LATE ?? 0);

    return {
      attendance: {
        ...counts,
        total,
        percentage: total
          ? Number(((attended / total) * 100).toFixed(2))
          : 0
      },
      recent: result.recent
    };
  }
};
