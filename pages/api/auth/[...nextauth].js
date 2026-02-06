// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Pwede magdagdag ng iba pang providers dito (e.g. GitHub, Facebook)
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ito yung random string na ginawa mo sa .env.local
  callbacks: {
    async session({ session, token, user }) {
      // Dito mo pwedeng idagdag ang user ID o iba pang info sa session object
      // na maa-access mo sa frontend.
      return session
    },
  },
}

export default NextAuth(authOptions)


