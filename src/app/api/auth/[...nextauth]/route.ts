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
  image?: string;
};

export const authOptions: NextAuthOptions = {
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

        const db: Db = (await connectDB())!;
        const user = await db.collection('users').findOne({ email });

        if (!user) {
          throw new Error('No user found with the provided email.');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Invalid credentials.');
        }

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
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as CustomUser).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = session.user || {};
        (session.user as CustomUser).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
