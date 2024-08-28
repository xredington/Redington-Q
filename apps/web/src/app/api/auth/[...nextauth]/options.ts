import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
    approved: boolean;
    noteId: string;
    isQCallAccessible: boolean;
    serviceAccessRoles: string[];
    image?: string; // Image field can be string, null, or undefined
  };
}

interface CustomAdapterUser extends AdapterUser {
  id: string;
  role: string;
  approved: boolean;
  noteId: string;
  isQCallAccessible: boolean;
  serviceAccessRoles: string[];
  image?: string; // Image field can be string, null, or undefined
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credentials are missing");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              serviceAccessRoles: {
                include: {
                  brand: true,
                },
              },
            },
          });

          if (!user || !(await bcryptjs.compare(credentials.password, user.password))) {
            console.error("Invalid credentials");
            return null;
          }

          if (!user.approved) {
            console.error("User not approved");
            throw new Error("Your account is not approved by the admin yet.");
          }

          let note = await prisma.note.findFirst({
            where: { userId: user.id },
          });

          if (!note) {
            note = await prisma.note.create({
              data: {
                userId: user.id,
                document: {},
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            approved: user.approved,
            noteId: note?.id || "",
            isQCallAccessible: user.isQCallAccessible,
            serviceAccessRoles: user?.serviceAccessRoles.map((role) => role.brand.name),
            image: user.image ?? '', 
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token }) {
      if (token?.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
          include: {
            serviceAccessRoles: {
              include: {
                brand: true,
              },
            },
          },
        });

        if (user) {
          const note = await prisma.note.findFirst({
            where: { userId: user.id },
          });

          (session as CustomSession).user = {
            id: user.id,
            name: user.name!,
            email: user.email,
            role: user.role,
            approved: user.approved,
            noteId: note?.id || "",
            isQCallAccessible: user.isQCallAccessible,
            serviceAccessRoles: user.serviceAccessRoles.map((role) => role.brand.name),
            image: user.image ?? '', // Set image in session, fallback to null
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approved = user.approved;
        token.noteId = user.noteId;
        token.isQCallAccessible = user.isQCallAccessible;
        token.serviceAccessRoles = user.serviceAccessRoles;
        token.image = user.image ?? ''; // Include the image in the JWT, fallback to null
      }
      return token;
    },
    async signIn({ user }) {
      if ((user as CustomAdapterUser).approved) {
        return true;
      } else {
        return "/auth/error?error=AccountNotApproved";
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
