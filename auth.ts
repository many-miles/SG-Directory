import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({
      user: { name, email, image },
      profile,
    }) {
      // Use the correct Google profile fields
      if (!profile) return false;
      
      const googleId = profile.sub; // Google's user ID
      const username = profile.email?.split('@')[0] || 'user'; // Generate username from email
      
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
          id: googleId, // Use Google's sub field as ID
        });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: googleId, // Store Google's sub as string ID
          name,
          username,
          email,
          image,
          bio: "", // Default empty bio
        });
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
            id: profile.sub, // Use Google's sub field
          });

        token.id = user?._id;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});