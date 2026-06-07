import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: Promise<{ slug: string; levelSlug: string; classSlug: string }>
}

export default async function TeacherClassPage({ params }: Props) {
  const { slug, levelSlug, classSlug } = await params
  const session = await auth()
  if (!session || session.user.role !== "teacher") redirect("/login")

  const teacher = await prisma.teacher.findUnique({ where: { slug } })
  if (!teacher || teacher.userId !== session.user.id) notFound()

  const level = await prisma.level.findUnique({ where: { slug: levelSlug } })
  if (!level) notFound()

  const cls = await prisma.class.findUnique({
    where: { levelId_slug: { levelId: level.id, slug: classSlug } },
    include: {
      students: { include: { student: true } },
      lessons: { where: { teacherId: teacher.id }, orderBy: { createdAt: "desc" } },
      announcements: { where: { teacherId: teacher.id }, orderBy: { createdAt: "desc" } },
    },
  })
  if (!cls) notFound()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href={`/teacher/${slug}/level/${levelSlug}`}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← {level.name}
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{cls.name}</h1>
          <p className="mt-1 text-gray-600">{level.name}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Announcements</h2>
              {cls.announcements.length === 0 ? (
                <p className="text-gray-500">No announcements.</p>
              ) : (
                <div className="space-y-3">
                  {cls.announcements.map((a) => (
                    <div key={a.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                      <h3 className="font-semibold text-gray-900">{a.title}</h3>
                      <p className="mt-2 text-gray-600">{a.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Lessons</h2>
              {cls.lessons.length === 0 ? (
                <p className="text-gray-500">No lessons.</p>
              ) : (
                <div className="space-y-3">
                  {cls.lessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="mt-1 text-sm text-gray-600">{lesson.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div>
            <section>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Students</h2>
              {cls.students.length === 0 ? (
                <p className="text-gray-500">No students enrolled.</p>
              ) : (
                <div className="space-y-2">
                  {cls.students.map((sc) => (
                    <div key={sc.id} className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200">
                      <p className="text-sm font-medium text-gray-900">{sc.student.fullName}</p>
                      <p className="text-xs text-gray-500">{sc.student.email}</p>
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
