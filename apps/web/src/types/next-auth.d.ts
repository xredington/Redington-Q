import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      approved: boolean;
      noteId: string;
      isQCallAccessible: boolean;
      image?: string;
      serviceAccessRoles: ('aruba' | 'fortinet' | 'hp' | 'huawei')[] | string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    approved: boolean;
    noteId: string;
    isQCallAccessible: boolean;
    image?: string;
    serviceAccessRoles: ('aruba' | 'fortinet' | 'hp' | 'huawei')[] | string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    approved: boolean;
    noteId: string;
    image?: string;
    isQCallAccessible: boolean;
    serviceAccessRoles: ('aruba' | 'fortinet' | 'hp' | 'huawei')[] | string[];
  }
}
