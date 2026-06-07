import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: Promise<{ slug: string; levelSlug: string }>
}

export default async function TeacherLevelPage({ params }: Props) {
  const { slug, levelSlug } = await params
  const session = await auth()
  if (!session || session.user.role !== "teacher") redirect("/login")

  const teacher = await prisma.teacher.findUnique({
    where: { slug },
  })
  if (!teacher || teacher.userId !== session.user.id) notFound()

  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
    include: {
      classes: true,
      lessons: { where: { teacherId: teacher.id }, orderBy: { createdAt: "desc" } },
      announcements: { where: { teacherId: teacher.id }, orderBy: { createdAt: "desc" } },
      exams: { where: { teacherId: teacher.id }, orderBy: { date: "desc" } },
    },
  })
  if (!level) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-8">
          <Link
            href="/teacher"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← My Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{level.name}</h1>
          <p className="mt-1 text-gray-600">{level.description}</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href={`/teacher/${slug}/level/${levelSlug}/lessons/new`}
            className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-700"
          >
            + New Lesson
          </Link>
          <Link
            href={`/teacher/${slug}/level/${levelSlug}/exams/new`}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + New Exam
          </Link>
          <Link
            href={`/teacher/${slug}/level/${levelSlug}/announcements/new`}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            + New Announcement
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {level.classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/teacher/${slug}/level/${levelSlug}/class/${cls.slug}`}
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition hover:bg-orange-50 hover:ring-orange-300"
            >
              {cls.name}
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Announcements</h2>
              {level.announcements.length === 0 ? (
                <p className="text-gray-500">No announcements yet.</p>
              ) : (
                <div className="space-y-3">
                  {level.announcements.map((a) => (
                    <div key={a.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{a.title}</h3>
                        {a.pinned && (
                          <span className="text-xs font-medium text-orange-600">📌 Pinned</span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600">{a.body}</p>
                      <p className="mt-3 text-xs text-gray-400">
                        {a.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Lessons</h2>
              {level.lessons.length === 0 ? (
                <p className="text-gray-500">No lessons yet.</p>
              ) : (
                <div className="space-y-3">
                  {level.lessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="mt-1 text-sm text-gray-600">{lesson.description}</p>
                      )}
                      <p className="mt-3 text-xs text-gray-400">
                        {lesson.publishedAt
                          ? `Published ${lesson.publishedAt.toLocaleDateString()}`
                          : "Draft"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Exams</h2>
              {level.exams.length === 0 ? (
                <p className="text-gray-500">No exams yet.</p>
              ) : (
                <div className="space-y-3">
                  {level.exams.map((exam) => (
                    <div key={exam.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Max: {exam.maxScore} | Coef: {exam.coefficient}
                      </p>
                      {exam.date && (
                        <p className="mt-1 text-xs text-gray-400">
                          {exam.date.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
