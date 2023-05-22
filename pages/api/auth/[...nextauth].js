import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { Storefront } from "@/utils"

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const LogInQuery = `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
          }
        }
        `
        const { email, password } = credentials
        const user = await Storefront(LogInQuery, "no-store", { input: { email, password } })
        if (user?.data?.customerAccessTokenCreate?.customerAccessToken !== null) {
          user.email = email
          return user
        }

        throw new Error("user not found")
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access = user.data
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      session.user = { email: token.email, access: token.access.customerAccessTokenCreate.customerAccessToken.accessToken }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
