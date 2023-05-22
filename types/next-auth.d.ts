import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's access token. */
      access: string
    } & DefaultSession["user"]
  }
}

import { Session } from "next-auth"

interface MySession extends Session {
  accessToken?: string
}

export default MySession
