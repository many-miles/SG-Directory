"use client";

import React, { useState, useActionState } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "../components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "../lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPitch } from "../lib/actions";
import { toast } from "sonner";

const ServiceForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast.success("Your service pitch has been created successfully");
        router.push(`/service/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast.error("Please check your inputs and try again");

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error has occurred");

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="service-form">
      <div>
        <label htmlFor="title" className="service-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="service-form_input"
          required
          placeholder="Service Title"
        />
        {errors.title && <p className="service-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="service-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="service-form_textarea"
          required
          placeholder="Service Description"
        />
        {errors.description && (
          <p className="service-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="service-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="service-form_input"
          required
          placeholder="Service Category (Tech, Health, Education...)"
        />
        {errors.category && (
          <p className="service-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="service-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="service-form_input"
          required
          placeholder="Service Image URL"
        />
        {errors.link && <p className="service-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="service-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="service-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="service-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default ServiceForm;