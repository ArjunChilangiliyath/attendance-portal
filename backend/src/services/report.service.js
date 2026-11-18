
import { attendanceRepository } from '../repositories/attendance.repository.js';

const csvCell = (value) =>
  `"${String(value ?? '').replaceAll('"', '""')}"`;

const dateOnly = (value) =>
  new Date(`${value}T00:00:00.000Z`);

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
