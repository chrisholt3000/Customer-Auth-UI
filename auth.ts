import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { decodeJwt } from "jose";

const customClaimNames = (process.env.AUTH_ENTRA_CUSTOM_CLAIMS ?? "")
  .split(",")
  .map((claim) => claim.trim())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        // Auth.js validates the OIDC ID token before invoking this callback.
        const claims = decodeJwt(account.id_token);
        token.entraClaims = Object.fromEntries(
          customClaimNames
            .filter((name) => Object.hasOwn(claims, name))
            .map((name) => [name, claims[name]]),
        );
      }

      return token;
    },
    async session({ session, token }) {
      const entraClaims: Record<string, unknown> = {};
      if (token.entraClaims && typeof token.entraClaims === "object") {
        Object.assign(entraClaims, token.entraClaims);
      }
      session.user.entraClaims = entraClaims;
      return session;
    },
  },
});
