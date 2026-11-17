import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      entraClaims: Record<string, unknown>;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    entraClaims?: Record<string, unknown>;
  }
}
