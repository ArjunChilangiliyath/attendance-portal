
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // 1. Create classes
  const classNames = ['A', 'B', 'C', 'D'];
  const classes = {};

  for (const section of classNames) {
    const code = `SCI-${section}`;

    classes[section] = await prisma.class.upsert({
      where: { code },
      update: {
        name: `Science ${section}`,
        academicYear: '2026-2027',
        description: `Science section ${section}`
      },
      create: {
        name: `Science ${section}`,
        code,
        academicYear: '2026-2027',
        description: `Science section ${section}`
      }
    });
  }

  console.log('4 classes created.');

  // 2. Create teachers
  const teacherData = [
    {
      email: 'maths.teacher@example.com',
      auth0Id: 'auth0|seed-maths-teacher',
      firstName: 'Rahul',
      lastName: 'Sharma',
      subject: 'Mathematics'
    },
    {
      email: 'physics.teacher@example.com',
      auth0Id: 'auth0|seed-physics-teacher',
      firstName: 'Priya',
      lastName: 'Nair',
      subject: 'Physics'
    },
    {
      email: 'chemistry.teacher@example.com',
      auth0Id: 'auth0|seed-chemistry-teacher',
      firstName: 'Arun',
      lastName: 'Menon',
      subject: 'Chemistry'
    }
  ];

  const teachers = [];

  for (const teacher of teacherData) {
    const createdTeacher = await prisma.user.upsert({
      where: { email: teacher.email },
      update: {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        role: 'TEACHER',
        subject: teacher.subject,
        isActive: true
      },
      create: {
        ...teacher,
        role: 'TEACHER'
      }
    });

    teachers.push(createdTeacher);
  }

  console.log('3 teachers created.');

  // 3. Assign all teachers to all four classes
  for (const teacher of teachers) {
    for (const section of classNames) {
      await prisma.classTeacher.upsert({
        where: {
          teacherId_classId: {
            teacherId: teacher.id,
            classId: classes[section].id
          }
        },
        update: {},
        create: {
          teacherId: teacher.id,
          classId: classes[section].id
        }
      });
    }
  }

  console.log('12 teacher-class assignments created.');

  // 4. Student names
  const studentNames = [
    ['Aarav', 'Sharma'],
    ['Diya', 'Patel'],
    ['Ishaan', 'Rao'],
    ['Anaya', 'Nair'],
    ['Vivaan', 'Mehta'],
    ['Aadhya', 'Iyer'],
    ['Aditya', 'Kumar'],
    ['Saanvi', 'Reddy'],
    ['Arjun', 'Menon'],
    ['Myra', 'Das'],

    ['Reyansh', 'Gupta'],
    ['Kiara', 'Shah'],
    ['Atharv', 'Joshi'],
    ['Anika', 'Pillai'],
    ['Kabir', 'Verma'],
    ['Ira', 'Krishnan'],
    ['Rohan', 'Bhat'],
    ['Navya', 'Rao'],
    ['Dev', 'Malhotra'],
    ['Sara', 'Thomas'],

    ['Vihaan', 'Kapoor'],
    ['Pari', 'Chopra'],
    ['Krish', 'Desai'],
    ['Tara', 'Menon'],
    ['Dhruv', 'Saxena'],
    ['Meera', 'Nambiar'],
    ['Karan', 'Singh'],
    ['Avni', 'Kulkarni'],
    ['Yash', 'Agarwal'],
    ['Ishita', 'Mishra'],

    ['Shaurya', 'Jain'],
    ['Riya', 'Sethi'],
    ['Manav', 'Rajan'],
    ['Tanvi', 'Ghosh'],
    ['Om', 'Chawla'],
    ['Nisha', 'Varma'],
    ['Aryan', 'Rastogi'],
    ['Pihu', 'Bose'],
    ['Samarth', 'Shetty'],
    ['Kavya', 'Ibrahim']
  ];

  // 5. Create 40 students (10 per class)
  const students = [];

  for (let i = 0; i < studentNames.length; i++) {
    const [firstName, lastName] = studentNames[i];

    const section = classNames[Math.floor(i / 10)];
    const number = String(i + 1).padStart(3, '0');

    const student = await prisma.user.upsert({
      where: {
        email: `student${number}@example.com`
      },
      update: {
        firstName,
        lastName,
        classId: classes[section].id,
        role: 'STUDENT',
        subject: null,
        isActive: true
      },
      create: {
        auth0Id: `auth0|seed-student-${number}`,
        email: `student${number}@example.com`,
        firstName,
        lastName,
        classId: classes[section].id,
        role: 'STUDENT'
      }
    });

    students.push(student);
  }

  console.log('40 students created.');

  // 6. Create sample attendance for five days
  const statuses = [
    'PRESENT',
    'PRESENT',
    'PRESENT',
    'LATE',
    'ABSENT'
  ];

  const attendanceDates = [
    new Date(Date.UTC(2026, 10, 2)),
    new Date(Date.UTC(2026, 10, 3)),
    new Date(Date.UTC(2026, 10, 4)),
    new Date(Date.UTC(2026, 10, 5)),
    new Date(Date.UTC(2026, 10, 6))
  ];

  const attendanceTeacher = teachers[0];

  for (let day = 0; day < attendanceDates.length; day++) {
    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: student.id,
            date: attendanceDates[day]
          }
        },
        update: {
          classId: student.classId,
          status: statuses[(i + day) % statuses.length],
          markedById: attendanceTeacher.id
        },
        create: {
          studentId: student.id,
          classId: student.classId,
          date: attendanceDates[day],
          status: statuses[(i + day) % statuses.length],
          markedById: attendanceTeacher.id
        }
      });
    }
  }

  console.log('200 attendance records created.');

  // 7. Create system settings
  const settings = {
    institution_name: 'Demo School',
    academic_year: '2026-2027',
    attendance_late_after_minutes: '10'
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  console.log('System settings created.');

  console.log('\n========== SEED SUMMARY ==========');
  console.log('Teachers: 3');
  console.log('Classes: 4');
  console.log('Students: 40');
  console.log('Teacher-class assignments: 12');
  console.log('Attendance records: 200');
  console.log('System settings: 3');
  console.log('==================================');
  console.log('Database seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
