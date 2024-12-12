"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import * as Sentry from "@sentry/nextjs";

const Registration = () => {
  

  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userID");
      if (userId) {
        try {
          const currentUser = await getUser(userId);
          setUser(currentUser);
          Sentry.metrics.set("user_view_register", currentUser.name);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container flex-1 flex-col py-10">
        <div className="sub-container max-w-[860px]">
          <Image
            src="/assets/icons/CareBuddy-full-logo.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />
          {user && <RegisterForm user={user} />}
        </div>
      </section>
    </div>
  );
};

export default Registration;