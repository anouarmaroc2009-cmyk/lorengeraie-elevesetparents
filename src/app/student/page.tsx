import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function StudentDashboard() {
  const session = await auth()
  if (!session || session.user.role !== "student") redirect("/login")

  const classes = await prisma.studentClass.findMany({
    where: { studentId: session.user.id },
    include: {
      class: {
        include: {
          level: true,
          teachers: {
            include: { teacher: { include: { user: true } } },
          },
        },
      },
    },
  })

  const levelsMap = new Map<string, { level: typeof classes[0]["class"]["level"]; classes: typeof classes }>()

  for (const sc of classes) {
    const levelId = sc.class.level.id
    if (!levelsMap.has(levelId)) {
      levelsMap.set(levelId, { level: sc.class.level, classes: [] })
    }
    levelsMap.get(levelId)!.classes.push(sc)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
            <p className="mt-1 text-gray-600">Welcome, {session.user.name}</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Home
          </Link>
        </div>

        {levelsMap.size === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
            <p className="text-gray-500">You are not enrolled in any classes yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Array.from(levelsMap.entries()).map(([levelId, { level, classes: levelClasses }]) => (
              <div key={levelId}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{level.name}</h2>
                  <Link
                    href={`/student/level/${level.slug}`}
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    View all →
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {levelClasses.map((sc) => {
                    const teacher = sc.class.teachers[0]?.teacher
                    return (
                      <Link
                        key={sc.id}
                        href={`/student/class/${sc.class.slug}`}
                        className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
                      >
                        <h3 className="font-semibold text-gray-900">{sc.class.name}</h3>
                        {teacher && (
                          <p className="mt-1 text-sm text-gray-500">{teacher.user.fullName}</p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
