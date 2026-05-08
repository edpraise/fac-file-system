import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/", "/resources/:path*", "/logs/:path*", "/settings/:path*", "/users/:path*"],
};
