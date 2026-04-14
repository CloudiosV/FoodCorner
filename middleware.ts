import { withAuth } from "next-auth/middleware";

// Kita bungkus secara eksplisit agar Next.js mengenali ini sebagai fungsi export
export default withAuth({
  pages: {
    signIn: "/login", // Arahkan ke halaman login kamu jika belum auth
  },
});

export const config = {
  matcher: [
    "/sales/:path*",
    "/products/:path*",
    "/category/:path*",
    "/promo/:path*",
    "/orders/:path*",
  ],
};