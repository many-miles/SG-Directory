import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Add any custom session logic here
      return session;
    },
    async signIn({ profile }) {
      try {
        // Add any custom sign-in logic here
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    }
  }
})