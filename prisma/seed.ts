import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const url = process.env.DATABASE_URL ?? "file:./dev.db"
const factory = new PrismaBetterSqlite3({ url })
const prisma = new PrismaClient({ adapter: factory })

async function main() {
  // Clean existing data
  await prisma.grade.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.studentClass.deleteMany()
  await prisma.teacherClass.deleteMany()
  await prisma.teacherLevel.deleteMany()
  await prisma.class.deleteMany()
  await prisma.level.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@orangeraie.edu",
      fullName: "Admin L'Orangeraie",
      role: "ADMIN",
    },
  })

  // Create teacher
  const teacherUser = await prisma.user.create({
    data: {
      email: "mr.smith@orangeraie.edu",
      fullName: "John Smith",
      role: "TEACHER",
    },
  })

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      slug: "mr-smith",
      bio: "Mathematics and Physics teacher",
    },
  })

  // Create levels
  const grade10 = await prisma.level.create({
    data: { name: "Grade 10", slug: "grade-10", description: "Première année du lycée" },
  })

  const grade11 = await prisma.level.create({
    data: { name: "Grade 11", slug: "grade-11", description: "Deuxième année du lycée" },
  })

  // Create classes
  const class10A = await prisma.class.create({
    data: { levelId: grade10.id, name: "Class A", slug: "class-a" },
  })

  const class10B = await prisma.class.create({
    data: { levelId: grade10.id, name: "Class B", slug: "class-b" },
  })

  const class11A = await prisma.class.create({
    data: { levelId: grade11.id, name: "Class A", slug: "class-a" },
  })

  // Assign teacher to levels and classes
  await prisma.teacherLevel.create({
    data: { teacherId: teacher.id, levelId: grade10.id },
  })
  await prisma.teacherLevel.create({
    data: { teacherId: teacher.id, levelId: grade11.id },
  })
  await prisma.teacherClass.create({
    data: { teacherId: teacher.id, classId: class10A.id },
  })
  await prisma.teacherClass.create({
    data: { teacherId: teacher.id, classId: class10B.id },
  })
  await prisma.teacherClass.create({
    data: { teacherId: teacher.id, classId: class11A.id },
  })

  // Create students
  const student1 = await prisma.user.create({
    data: {
      email: "alice@orangeraie.edu",
      fullName: "Alice Dupont",
      role: "STUDENT",
    },
  })

  const student2 = await prisma.user.create({
    data: {
      email: "bob@orangeraie.edu",
      fullName: "Bob Martin",
      role: "STUDENT",
    },
  })

  // Enroll students
  await prisma.studentClass.create({
    data: { studentId: student1.id, classId: class10A.id },
  })
  await prisma.studentClass.create({
    data: { studentId: student2.id, classId: class10A.id },
  })
  await prisma.studentClass.create({
    data: { studentId: student2.id, classId: class10B.id },
  })

  // Create announcements
  await prisma.announcement.create({
    data: {
      teacherId: teacher.id,
      levelId: grade10.id,
      classId: class10A.id,
      title: "Welcome to Grade 10!",
      body: "Welcome to the new school year. Please check the lessons section for the syllabus.",
      pinned: true,
    },
  })

  await prisma.announcement.create({
    data: {
      teacherId: teacher.id,
      levelId: grade10.id,
      title: "Exam Schedule Updated",
      body: "The mid-term exam schedule has been posted. Please review the dates.",
    },
  })

  // Create lessons
  await prisma.lesson.create({
    data: {
      teacherId: teacher.id,
      levelId: grade10.id,
      classId: class10A.id,
      title: "Introduction to Algebra",
      description: "Fundamental concepts of algebra including variables, expressions, and equations.",
      publishedAt: new Date(),
    },
  })

  await prisma.lesson.create({
    data: {
      teacherId: teacher.id,
      levelId: grade10.id,
      classId: class10A.id,
      title: "Linear Equations",
      description: "Solving linear equations in one and two variables.",
      publishedAt: new Date(),
    },
  })

  // Create exams
  const exam1 = await prisma.exam.create({
    data: {
      teacherId: teacher.id,
      levelId: grade10.id,
      classId: class10A.id,
      title: "Algebra Mid-Term",
      date: new Date("2026-10-15"),
      maxScore: 20,
      coefficient: 2,
    },
  })

  const exam2 = await prisma.exam.create({
    data: {
      teacherId: teacher.id,
      levelId: grade10.id,
      classId: class10A.id,
      title: "Geometry Quiz",
      date: new Date("2026-11-01"),
      maxScore: 10,
      coefficient: 1,
    },
  })

  // Create grades
  await prisma.grade.create({
    data: { examId: exam1.id, studentId: student1.id, score: 16, comment: "Excellent work!" },
  })
  await prisma.grade.create({
    data: { examId: exam1.id, studentId: student2.id, score: 12, comment: "Good effort" },
  })
  await prisma.grade.create({
    data: { examId: exam2.id, studentId: student1.id, score: 9, comment: "Well done" },
  })
  await prisma.grade.create({
    data: { examId: exam2.id, studentId: student2.id, score: 7, comment: "Keep practicing" },
  })

  console.log("Seed completed successfully!")
  console.log(`  Admin:    admin@orangeraie.edu`)
  console.log(`  Teacher:  mr.smith@orangeraie.edu`)
  console.log(`  Students: alice@orangeraie.edu, bob@orangeraie.edu`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
