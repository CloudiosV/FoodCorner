import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Kosongkan saja atau hapus bagian pages-nya
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