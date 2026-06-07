import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">Manage users, levels, and classes</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Home
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/admin/users"
            className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl text-blue-600">
              👥
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
            <p className="mt-1 text-gray-600">Create and manage accounts, assign roles</p>
          </Link>

          <Link
            href="/admin/levels"
            className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl text-green-600">
              📚
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Levels &amp; Classes</h2>
            <p className="mt-1 text-gray-600">Configure grade levels and class groups</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
