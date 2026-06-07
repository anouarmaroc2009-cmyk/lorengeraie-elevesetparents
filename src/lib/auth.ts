import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

const adapter = PrismaAdapter(prisma)
const origCreateUser = adapter.createUser!
adapter.createUser = async (data) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email! } })
  if (existing) return { ...existing, id: existing.id, emailVerified: existing.emailVerified ?? null }
  return prisma.user.create({
    data: {
      email: data.email!,
      fullName: data.name ?? data.email!.split("@")[0],
      avatarUrl: data.image ?? null,
      emailVerified: data.emailVerified ?? null,
      role: "STUDENT",
    },
  })
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await prisma.user.findUnique({
          where: { email: profile.email! },
          include: { teacher: true },
        })
        if (user) {
          token.id = user.id
          token.role = user.role
          token.teacherSlug = user.teacher?.slug ?? null
          token.picture = user.avatarUrl ?? profile.picture
        }
      } else if (token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
          include: { teacher: true },
        })
        if (user) {
          token.id = user.id
          token.role = user.role
          token.teacherSlug = user.teacher?.slug ?? null
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.teacherSlug = token.teacherSlug as string | null
      return session
    },
  },
})
