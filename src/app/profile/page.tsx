"use client";
import { ProfileArea } from "@/components/component/profile-area";
import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  // const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const router = useRouter();
  // useEffect(() => {
  //   if (!loading && !user) {
  //     toast.error("You need to be logged in to view this page");
  //     router.push("/login");
  //   }
  // }, [loading, user]);
  // // Check if user is loaded and set loading to false
  // useEffect(() => {
  //   if (user !== undefined) {
  //     setLoading(false);
  //   }
  // }, [user]);

  return (
    <div className="max-lg:mx-20">
      <ProfileArea />
    </div>
  );
}
