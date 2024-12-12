"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormfield from "@/components/CustomFormfield";
import SubmitButton from "../SubmitButton";
import { use, useEffect, useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, getUser } from "@/lib/actions/patient.actions";
import Link from "next/link";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const [guestUser, setGuestUser] = useState<User>();
  const guestuserID = process.env.NEXT_PUBLIC_GUEST_USER

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setisLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);

      if (user) {
        localStorage.setItem("userID", user.$id);
        router.push(`/patients/register`);
      }
    } catch (error) {
      console.error("An error occurred during user creation:", error);
    } finally {
      setisLoading(false);
    }
  }

  const proceedWithGuest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("guestUser", guestuserID);
    localStorage.setItem("userID", guestuserID||"");
    router.push(`/patients/register`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>

        <CustomFormfield
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormfield
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormfield
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone no."
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        <div>
          <br />
          Or <span>&nbsp;</span>
          {guestuserID ? (
            <button className="text-green-500" onClick={proceedWithGuest}>
              Continue as Guest
            </button>
          ) : (
            <span>Initiating guest user...</span>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PatientForm;
