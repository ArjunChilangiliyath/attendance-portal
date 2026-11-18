
import { attendanceRepository } from '../repositories/attendance.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { classRepository } from '../repositories/class.repository.js';

// Build CSV cell values safely
const csvCell = (value) =>
  `"${String(value ?? '').replaceAll('"', '""')}"`;

// Convert date strings into UTC dates
const dateOnly = (value) =>
  new Date(`${value}T00:00:00.000Z`);

// Generate CSV from attendance records
export const buildAttendanceCsv = (data) => {
  const rows = [
    [
      'Date',
      'Class',
      'Class code',
      'Student',
      'Email',
      'Status',
      'Remarks',
      'Marked by',
      'Latest changed by'
    ],

    ...data.map((attendance) => [
      attendance.date.toISOString().slice(0, 10),
      attendance.class.name,
      attendance.class.code,
      `${attendance.student.firstName} ${attendance.student.lastName}`,
      attendance.student.email,
      attendance.status,
      attendance.remarks,
      attendance.markedBy
        ? `${attendance.markedBy.firstName} ${attendance.markedBy.lastName}`
        : '',
      attendance.latestChangedBy
        ? `${attendance.latestChangedBy.firstName} ${attendance.latestChangedBy.lastName}`
        : ''
    ])
  ];

  return rows
    .map((row) => row.map(csvCell).join(','))
    .join('\r\n');
};

// Report service methods
export const reportService = {

  // Retrieve attendance report for a student
  student: async (studentId) => {
    const student = await userRepository.findById(studentId);

    if (!student || student.role !== 'STUDENT') {
      return null;
    }

    const attendance =
      await attendanceRepository.historyForStudent(studentId);

    const total = attendance.length;

    const present = attendance.filter(
      (record) => record.status === 'PRESENT'
    ).length;

    const absent = attendance.filter(
      (record) => record.status === 'ABSENT'
    ).length;

    const late = attendance.filter(
      (record) => record.status === 'LATE'
    ).length;

    const excused = attendance.filter(
      (record) => record.status === 'EXCUSED'
    ).length;

    return {
      student,
      summary: {
        total,
        present,
        absent,
        late,
        excused,
        attendancePercentage:
          total === 0
            ? 0
            : Number(((present / total) * 100).toFixed(2))
      },
      attendance
    };
  },

  // Retrieve attendance report for a class
  class: async (classId) => {
    const classData = await classRepository.find(classId);

    if (!classData) {
      return null;
    }

    const attendance =
      await attendanceRepository.historyForClass(classId);

    const total = attendance.length;

    const present = attendance.filter(
      (record) => record.status === 'PRESENT'
    ).length;

    const absent = attendance.filter(
      (record) => record.status === 'ABSENT'
    ).length;

    const late = attendance.filter(
      (record) => record.status === 'LATE'
    ).length;

    const excused = attendance.filter(
      (record) => record.status === 'EXCUSED'
    ).length;

    return {
      class: classData,
      summary: {
        total,
        present,
        absent,
        late,
        excused,
        attendancePercentage:
          total === 0
            ? 0
            : Number(((present / total) * 100).toFixed(2))
      },
      attendance
    };
  }
};

// Export attendance records as CSV
export const exportAttendanceCsv = async (query) => {
  const where = {
    ...(query.classId ? { classId: query.classId } : {}),
    ...(query.studentId ? { studentId: query.studentId } : {}),
    ...(query.from || query.to
      ? {
          date: {
            ...(query.from ? { gte: dateOnly(query.from) } : {}),
            ...(query.to ? { lte: dateOnly(query.to) } : {})
          }
        }
      : {})
  };

  const { data } = await attendanceRepository.list({
    where,
    skip: 0,
    take: 10000
  });

  return buildAttendanceCsv(data);
};
