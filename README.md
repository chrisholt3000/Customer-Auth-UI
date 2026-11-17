# Next Entra customer portal

This Next.js app uses Auth.js with OpenID Connect to sign customers in through
the same Microsoft Entra External ID tenant as the ASP.NET app. Entra continues
to invoke the tenant's configured Azure Function/custom claims extension during
token issuance; this app reads the selected claims from the validated ID token.

## Configure Entra

1. Prefer the same Entra External ID app registration as the ASP.NET app so
   the existing claims extension applies. If you create a separate registration,
   configure the extension to return claims for that app as well.
2. Add these **Web** redirect URIs to the app registration:
   - `http://localhost:3000/api/auth/callback/microsoft-entra-id`
   - `https://<your-production-host>/api/auth/callback/microsoft-entra-id`
3. Use the client ID, client secret, and exact OIDC issuer/authority from the
   ASP.NET configuration. Keep the existing token-issuance extension enabled
   and ensure its custom claims are included in the ID token for this app.

## Configure the app

Copy `.env.example` to `.env.local` and set:

- `AUTH_SECRET`: generate a unique secret with
  `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.
- `AUTH_MICROSOFT_ENTRA_ID_ID`: the app registration's client ID.
- `AUTH_MICROSOFT_ENTRA_ID_SECRET`: the client secret **value**.
- `AUTH_MICROSOFT_ENTRA_ID_ISSUER`: the tenant's exact OIDC issuer URL. For
  External ID, copy this from the ASP.NET app's OIDC configuration/discovery
  metadata rather than substituting a workforce Entra URL.
- `AUTH_ENTRA_CUSTOM_CLAIMS`: comma-separated names of the custom ID-token
  claims to expose, for example `customerId,subscriptionLevel`. Only these
  allowlisted claims are added to the Auth.js session.

Keep `.env.local` and all credentials out of source control. Add the same
variables to the hosting environment. If the Azure hosting setup requires
Auth.js to trust the forwarded host header, configure `AUTH_TRUST_HOST=true`
only when requests come through a trusted proxy.

Run locally with `npm run dev`. The home page provides sign-in, sign-out, and a
view of the configured custom claims. In application code, use `auth()` on the
server and read the selected values from `session.user.entraClaims`.
