export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/sales/:path*",
    "/products/:path*",
    "/category/:path*",
    "/promo/:path*",
    "/orders/:path*",
  ],
};