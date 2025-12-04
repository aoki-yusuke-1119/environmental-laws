import NextAuth from "next-auth";
import { createCayzenAuthConfig } from "@cayzen/nextauth";

const authOptions = createCayzenAuthConfig({
  productId: "env-laws",
  issuer: process.env.OAUTH_ISSUER!,
  clientId: process.env.OAUTH_CLIENT_ID!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
