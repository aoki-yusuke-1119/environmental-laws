import { createCayzenMiddleware } from "@cayzen/nextauth/middleware";

export default createCayzenMiddleware({
  productId: "env-laws",
  allowedIps: process.env.ALLOWED_IPS?.split(",").map((ip) => ip.trim()),
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)",
  ],
};
