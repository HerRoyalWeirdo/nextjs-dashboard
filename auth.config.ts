import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',//redirected here instead of default
    },
    //protect routes so only log in can access
    callbacks: {
      // auth = user session, request = incoming req from object
    authorized({ auth, request: { nextUrl } }) {
      const isNotLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isNotLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isNotLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },//log in options?
    providers: [] //cause it would not satifies
} satisfies NextAuthConfig;

//authorization - should this person be allowed
//authentication - verify indentity