import Link from "next/link"
import { auth, signOut } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-12 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-600 text-4xl text-white">
            🍊
          </div>
          <h1 className="text-4xl font-bold text-gray-900">L&apos;Orangeraie</h1>
          <p className="mt-2 text-lg text-gray-600">Students &amp; Parents Portal</p>
        </div>

        <div className="space-y-4">
          {session ? (
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                Welcome back, <span className="font-semibold">{session.user.name}</span>
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-lg bg-orange-600 px-8 py-3 text-center font-medium text-white transition hover:bg-orange-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {session.user.role === "teacher" && (
                  <Link
                    href="/teacher"
                    className="rounded-lg bg-orange-600 px-8 py-3 text-center font-medium text-white transition hover:bg-orange-700"
                  >
                    My Dashboard
                  </Link>
                )}
                {session.user.role === "student" && (
                  <Link
                    href="/student"
                    className="rounded-lg bg-orange-600 px-8 py-3 text-center font-medium text-white transition hover:bg-orange-700"
                  >
                    My Classes
                  </Link>
                )}
              </div>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="rounded-lg bg-orange-600 px-8 py-3 text-center font-medium text-white transition hover:bg-orange-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-orange-600 px-8 py-3 text-center font-medium text-orange-600 transition hover:bg-orange-50"
              >
                Request Account
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { title: "Lessons", desc: "Access course materials, PDFs, and video lessons" },
            { title: "Grades", desc: "View exam scores and track your progress" },
            { title: "Updates", desc: "Stay informed with teacher announcements" },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl bg-orange-50 p-5 text-center">
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
