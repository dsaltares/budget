import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@server/prisma';
import { sendVerificationRequest } from '@server/auth/email';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '1025', 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    session: async ({ session, user }) => {
      session.userId = user.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);
