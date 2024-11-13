import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export enum AuthProvider {
  Github = "github",
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});
