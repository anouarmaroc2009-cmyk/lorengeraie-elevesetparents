import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function TeacherDashboard() {
  const session = await auth()
  if (!session || session.user.role !== "teacher") redirect("/login")

  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      levels: {
        include: {
          level: {
            include: { classes: true },
          },
        },
      },
    },
  })

  if (!teacher) redirect("/")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="mt-1 text-gray-600">Welcome, {session.user.name}</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Home
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teacher.levels.map((tl) => (
            <Link
              key={tl.level.id}
              href={`/teacher/${teacher.slug}/level/${tl.level.slug}`}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">{tl.level.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{tl.level.description}</p>
              {tl.level.classes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tl.level.classes.map((cls) => (
                    <span
                      key={cls.id}
                      className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                    >
                      {cls.name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
