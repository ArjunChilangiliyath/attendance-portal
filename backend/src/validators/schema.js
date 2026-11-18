
import { z } from 'zod';

// Reusable validation helpers

const optionalText = (max) =>
  z.string().trim().max(max).optional().nullable();

const requiredText = (max) =>
  z.string().trim().min(1).max(max);

const requiredId = z
  .string()
  .trim()
  .min(1, 'ID is required');

const optionalId = requiredId.optional();

// Validate common Express request structure
const requestSchema = (body) =>
  z.object({
    body,
    params: z.any().optional(),
    query: z.any().optional(),
  });

// Validate actual calendar date in YYYY-MM-DD format
const dateString = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Date must use YYYY-MM-DD format'
  )
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, 'Invalid calendar date');

// Student schemas

export const studentCreate = requestSchema(
  z.object({
    email: z.string().trim().email().toLowerCase(),
    firstName: requiredText(100),
    lastName: requiredText(100),
    phone: optionalText(30),
    classId: requiredId,
  })
);

export const studentUpdate = requestSchema(
  z
    .object({
      firstName: requiredText(100).optional(),
      lastName: requiredText(100).optional(),
      phone: optionalText(30),
      classId: requiredId.optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      'At least one field must be provided.'
    )
);

// Class schemas

export const classCreate = requestSchema(
  z.object({
    name: requiredText(120),
    code: requiredText(30),
    description: optionalText(2000),
    academicYear: optionalText(20),
  })
);

export const classUpdate = requestSchema(
  z
    .object({
      name: requiredText(120).optional(),
      code: requiredText(30).optional(),
      description: optionalText(2000),
      academicYear: optionalText(20),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      'At least one field must be provided.'
    )
);

// Teacher-class assignment schemas

export const teacherClassAssign = requestSchema(
  z.object({
    teacherId: requiredId,
    classId: requiredId,
  })
);

export const teacherClassRemove = requestSchema(
  z.object({
    teacherId: requiredId,
    classId: requiredId,
  })
);

// Attendance schemas

const attendanceStatus = z.enum([
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
]);

export const attendanceBulk = requestSchema(
  z.object({
    classId: requiredId,
    date: dateString,
    records: z
      .array(
        z.object({
          studentId: requiredId,
          status: attendanceStatus,
          remarks: optionalText(500),
        })
      )
      .min(1, 'At least one attendance record is required.')
      .superRefine((records, ctx) => {
        const studentIds = records.map(
          (record) => record.studentId
        );

        if (new Set(studentIds).size !== studentIds.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Duplicate student IDs are not allowed.',
          });
        }
      }),
  })
);

export const attendanceUpdate = requestSchema(
  z
    .object({
      status: attendanceStatus.optional(),
      remarks: optionalText(500),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      'At least one field must be provided.'
    )
);

// Profile schemas

export const profileUpdate = requestSchema(
  z
    .object({
      firstName: requiredText(100).optional(),
      lastName: requiredText(100).optional(),
      phone: optionalText(30),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      'At least one field must be provided.'
    )
);

// Settings schemas

export const settingsUpdate = requestSchema(
  z.object({
    settings: z.record(
      z.string().min(1),
      z.string()
    ),
  })
);