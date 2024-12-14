import { connectDB } from "@/lib/connectDB";
import NextAuth, { DefaultSession } from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ObjectId } from "mongodb";

interface User {
  _id: ObjectId;
  email: string;
  password?: string;
  name?: string;
  image?: string;
}

interface GoogleUser {
  name?: string;
  email?: string;
  image?: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;

          const { email, password } = credentials;
          if (!email || !password) return null;

          const db = await connectDB();
          if (!db) throw new Error("Database connection failed.");

          const currentUser = (await db
            .collection<User>("users")
            .findOne({ email })) || null;

          if (!currentUser || !currentUser.password) return null;

          const passwordMatched = await bcrypt.compare(password, currentUser.password);
          if (!passwordMatched) return null;

          return { id: currentUser._id.toString(), email: currentUser.email };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { email, name, image } = user as GoogleUser;

        if (!email) {
          console.error("Google user does not have an email!");
          return false;
        }

        try {
          const db = await connectDB();
          if (!db) throw new Error("Database connection failed.");

          const userCollection = db.collection<User>("users");
          const userExist = await userCollection.findOne({ email });

          if (!userExist) {
            await userCollection.insertOne({
                name, email, image,
                _id: new ObjectId
            });
          }

          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
