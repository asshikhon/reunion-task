import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/connectDB';
import { Db } from 'mongodb';

type CustomUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error('Email and password are required.');
        }

        const db: Db = (await connectDB())!; // Ensure the database connection is correct
        const user = await db.collection('users').findOne({ email });

        if (!user) {
          throw new Error('No user found with the provided email.');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Invalid credentials.');
        }

        // Returning a user object that will be saved in the session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    // Called whenever a user signs in, this ensures that a user is created in the DB if it's their first time
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const db: Db = (await connectDB())!;

        const existingUser = await db.collection('users').findOne({ email: user.email });

        if (!existingUser) {
          await db.collection('users').insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
      }
      return true;
    },

    // Called when the JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as CustomUser).id; // Add the custom id to the JWT token
      }
      return token;
    },

    // Called when the session is created or updated
    async session({ session, token }) {
      if (token.id) {
        session.user = session.user || {};
        (session.user as CustomUser).id = token.id as string; // Add the custom id to the session
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom sign-in page
  },
  debug: true, // Helpful for debugging in development
};

// Handler for NextAuth API route
const handler = NextAuth(authOptions);

// Explicitly define the methods to ensure proper typing
export { handler as GET, handler as POST };
