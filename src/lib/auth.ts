import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
    async signIn({ profile }) {
      if (!profile?.email) return false
      const user = await prisma.user.findUnique({ where: { email: profile.email } })
      return !!user
    },
  },
})
