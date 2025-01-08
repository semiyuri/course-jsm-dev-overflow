"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { AuthFormType } from "@/types/auth";
import { ActionResponse } from "@/types/global";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: AuthFormType;
  onSubmit: (data: T) => Promise<ActionResponse>;
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast({
        title: "Success",
        description:
          formType === AuthFormType.SignIn
            ? "Signed in successfully"
            : "Signed up successfully",
      });

      router.push(ROUTES.HOME);
    } else {
      toast({
        title: `Error ${result?.status}`,
        description: result?.error?.message,
        variant: "destructive",
      });
    }
  };

  const buttonText = formType === AuthFormType.SignIn ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            name={field as Path<T>}
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>

                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
          {form.formState.isSubmitting ? "Loading..." : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
