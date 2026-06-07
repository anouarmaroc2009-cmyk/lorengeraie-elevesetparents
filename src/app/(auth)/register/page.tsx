import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-3xl text-white">
            🍊
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Request Account</h1>
          <p className="mt-1 text-gray-600">Contact your administrator to create an account</p>
        </div>

        <div className="rounded-xl bg-orange-50 p-6 text-center">
          <p className="text-gray-700">
            Account creation is managed by your school administration.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Please reach out to the L&apos;Orangeraie admin team to get your credentials.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
