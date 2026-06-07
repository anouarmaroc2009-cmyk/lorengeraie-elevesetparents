import Link from "next/link"

export default function AdminLevelsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 underline">
            ← Back to Admin
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Levels &amp; Classes</h1>
          <p className="mt-1 text-gray-600">Configure grade levels and class groups</p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <p className="text-center text-gray-500">
            Level and class management interface — connect to your database to populate this view.
          </p>
        </div>
      </div>
    </div>
  )
}
