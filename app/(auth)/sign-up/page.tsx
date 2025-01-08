"use client";

import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";
import { AuthFormType } from "@/types/auth";

const SignUp = () => {
  return (
    <AuthForm
      formType={AuthFormType.SignUp}
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;
