"use client";

import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema } from "@/lib/validations";
import { AuthFormType } from "@/types/auth";

const SignIn = () => {
  return (
    <AuthForm
      formType={AuthFormType.SignIn}
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;
