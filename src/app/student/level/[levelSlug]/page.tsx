import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ levelSlug: string }>
}

export default async function StudentLevelPage({ params }: Props) {
  const { levelSlug } = await params
  const session = await auth()
  if (!session || session.user.role !== "student") redirect("/login")

  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
  })
  if (!level) notFound()

  const studentClasses = await prisma.studentClass.findMany({
    where: { studentId: session.user.id },
    include: { class: true },
  })

  const levelClassIds = studentClasses
    .filter((sc: { class: { levelId: string; id: string } }) => sc.class.levelId === level.id)
    .map((sc) => sc.class.id)

  if (levelClassIds.length === 0) notFound()

  const announcements = await prisma.announcement.findMany({
    where: { classId: { in: levelClassIds } },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { teacher: { include: { user: true } } },
    take: 20,
  })

  const lessons = await prisma.lesson.findMany({
    where: { classId: { in: levelClassIds }, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { teacher: { include: { user: true } } },
    take: 20,
  })

  const exams = await prisma.exam.findMany({
    where: { classId: { in: levelClassIds } },
    orderBy: { date: "desc" },
  })

  const grades = await prisma.grade.findMany({
    where: {
      studentId: session.user.id,
      examId: { in: exams.map((e) => e.id) },
    },
    include: { exam: { include: { teacher: { include: { user: true } } } } },
  })

  const gradesByExamId = new Map(grades.map((g) => [g.examId, g]))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/student"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← My Classes
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{level.name}</h1>
          {level.description && (
            <p className="mt-1 text-gray-600">{level.description}</p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            {/* Announcements */}
            <section>
              <h2 className="mb-5 text-xl font-semibold text-gray-900">
                Announcements
              </h2>
              {announcements.length === 0 ? (
                <p className="text-gray-500">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 ${
                        a.pinned ? "ring-2 ring-orange-300" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{a.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {a.teacher.user.fullName}
                          </p>
                        </div>
                        {a.pinned && (
                          <span className="text-xs font-medium text-orange-600 whitespace-nowrap">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-gray-700">{a.body}</p>
                      <p className="mt-3 text-xs text-gray-400">
                        {a.createdAt.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Lessons */}
            <section>
              <h2 className="mb-5 text-xl font-semibold text-gray-900">Lessons</h2>
              {lessons.length === 0 ? (
                <p className="text-gray-500">No lessons published yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {lesson.teacher.user.fullName}
                        </span>
                        {lesson.attachments && Array.isArray(lesson.attachments) && (
                          <span className="text-xs text-gray-400">
                            {lesson.attachments.length} file(s)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Grades Sidebar */}
          <aside>
            <section>
              <h2 className="mb-5 text-xl font-semibold text-gray-900">Grades</h2>
              {exams.length === 0 ? (
                <p className="text-gray-500">No grades published yet.</p>
              ) : (
                <div className="space-y-3">
                  {exams.map((exam) => {
                    const grade = gradesByExamId.get(exam.id)
                    return (
                      <div
                        key={exam.id}
                        className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                          {grade ? (
                            <span
                              className={`text-lg font-bold ${
                                grade.score >= exam.maxScore * 0.5
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {grade.score}/{exam.maxScore}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          Coef: {exam.coefficient}
                          {exam.date && ` • ${exam.date.toLocaleDateString("fr-FR")}`}
                        </p>
                        {grade?.comment && (
                          <p className="mt-2 text-xs text-gray-500 italic">
                            {grade.comment}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
