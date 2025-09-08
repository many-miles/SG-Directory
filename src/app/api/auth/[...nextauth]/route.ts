import { sign } from "crypto";
import { handlers } from "../../../../../auth" // Referring to the auth.ts created
import GoogleProvider from "next-auth/providers/google" ; 
import NextAuth from "next-auth";

console.log({ 
    clientId: process.env.AUTH_GOOGLE_ID, 
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
})

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })
    ],
    async session({ session }) { 

    },
    async signIn({ profile }) {
      try {
          
      } catch (error) {
          
      }
    }
})


export const { GET, POST } = handlers