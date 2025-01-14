import { AuthProvider } from "./auth";

export interface SignInWithOAuthParams {
  provider: AuthProvider;
  providerAccountId: string;
  user: { email: string; name: string; image: string; username: string };
}

export interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

export interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}
