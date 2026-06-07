import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ classSlug: string }>
}

export default async function StudentClassPage({ params }: Props) {
  const { classSlug } = await params
  const session = await auth()
  if (!session || session.user.role !== "student") redirect("/login")

  const cls = await prisma.class.findUnique({
    where: { levelId_slug: { levelId: "", slug: classSlug } },
  })
  if (!cls) notFound()

  const enrollment = await prisma.studentClass.findFirst({
    where: { studentId: session.user.id, classId: cls.id },
  })
  if (!enrollment) notFound()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/student" className="text-sm text-gray-500 hover:text-gray-700 underline">
          ← My Classes
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{cls.name}</h1>
      </div>
    </div>
  )
}
