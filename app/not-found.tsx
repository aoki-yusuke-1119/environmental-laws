import { NotFoundPage } from "@cayzen/nextauth";

export default function NotFound() {
  return <NotFoundPage oauthIssuer={process.env.NEXT_PUBLIC_OAUTH_ISSUER!} />;
}
