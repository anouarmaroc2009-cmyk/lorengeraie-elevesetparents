import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function NewAnnouncementPage({
  params,
}: {
  params: Promise<{ slug: string; levelSlug: string }>
}) {
  const { slug, levelSlug } = await params
  const session = await auth()
  if (!session || session.user.role !== "teacher") redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href={`/teacher/${slug}/level/${levelSlug}`}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← Back
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">New Announcement</h1>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <p className="text-center text-gray-500">
            Announcement creation form — compose a message for your students.
          </p>
        </div>
      </div>
    </div>
  )
}
