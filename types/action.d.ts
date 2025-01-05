import { AuthProvider } from "./auth";

export interface SignInWithOAuthParams {
  provider: AuthProvider;
  providerAccountId: string;
  user: { email: string; name: string; image: string; username: string };
}
