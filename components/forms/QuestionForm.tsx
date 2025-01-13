"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { createQuestion } from "@/lib/actions/question.actions";
import { AskQuestionSchema } from "@/lib/validations";

import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const QuestionForm = () => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const formContext = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });
  const { control, handleSubmit, setValue, clearErrors, setError } =
    formContext;

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = e.currentTarget.value.trim();

      if (value && value.length < 15 && !field.value.includes(value)) {
        setValue("tags", [...field.value, value]);
        e.currentTarget.value = "";
        clearErrors("tags");
      } else if (value.length >= 15) {
        setError("tags", { message: "Tag should be less than 15 characters" });
      } else if (field.value.includes(value)) {
        setError("tags", { message: "Tag already exists" });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    setValue("tags", newTags);

    if (newTags.length === 0) {
      setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>
  ) => {
    startTransition(async () => {
      const result = await createQuestion(data);

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Question created successfully",
        });

        router.push(ROUTES.QUESTION(result.data._id));
      } else {
        toast({
          title: `Error: ${result.status}`,
          description: result.error?.message || "Failed to create question",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...formContext}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>

              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <Editor
                  value={field.value}
                  fieldChange={field.onChange}
                  editorRef={editorRef}
                />
              </FormControl>

              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />

                  <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                    {field.value.map((tag) => (
                      <TagCard
                        key={tag}
                        _id={tag}
                        name={tag}
                        compact
                        remove
                        isButton
                        handleRemove={() => handleTagRemove(tag, field)}
                      />
                    ))}
                  </div>
                </div>
              </FormControl>

              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit !text-light-900"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              "Ask A Question"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
