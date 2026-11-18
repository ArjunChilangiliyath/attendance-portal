import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient();
async function main(){
  const c1=await prisma.class.upsert({where:{code:'10-A'},update:{},create:{name:'Grade 10 - Section A',code:'10-A',academicYear:'2026-2027',description:'Grade 10 section A'}});
  const c2=await prisma.class.upsert({where:{code:'10-B'},update:{},create:{name:'Grade 10 - Section B',code:'10-B',academicYear:'2026-2027',description:'Grade 10 section B'}});
  await prisma.user.upsert({where:{email:'teacher@example.com'},update:{},create:{auth0Id:'auth0|seed-teacher-001',email:'teacher@example.com',firstName:'Demo',lastName:'Teacher',role:'TEACHER'}});
  const students=[['student1@example.com','Aarav','Sharma',c1.id,'auth0|seed-student-001'],['student2@example.com','Diya','Patel',c1.id,'auth0|seed-student-002'],['student3@example.com','Ishaan','Rao',c2.id,'auth0|seed-student-003'],['student4@example.com','Anaya','Nair',c2.id,'auth0|seed-student-004']];
  for(const [email,firstName,lastName,classId,auth0Id] of students) await prisma.user.upsert({where:{email},update:{},create:{auth0Id,email,firstName,lastName,classId,role:'STUDENT'}});
  const teacher=await prisma.user.findUnique({where:{email:'teacher@example.com'}});
  const all=await prisma.user.findMany({where:{role:'STUDENT'}});
  const statuses=['PRESENT','PRESENT','LATE','ABSENT','PRESENT'];
  for(let day=0;day<5;day++){const date=new Date(Date.UTC(2026,10,2+day));for(let i=0;i<all.length;i++)await prisma.attendance.upsert({where:{studentId_date:{studentId:all[i].id,date}},update:{},create:{studentId:all[i].id,classId:all[i].classId,date:date,status:statuses[(i+day)%statuses.length],markedById:teacher.id}});}
  for(const [key,value] of Object.entries({'institution_name':'Demo School','academic_year':'2026-2027','attendance_late_after_minutes':'10'})) await prisma.systemSetting.upsert({where:{key},update:{},create:{key,value}});
  console.log('Seed completed. Demo records created; create matching Auth0 users before attempting login.');
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
