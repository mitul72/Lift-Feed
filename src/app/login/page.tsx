"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { useUserAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Login() {
  const { handleSignIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      handleSignIn(email, password);
      router.push("/profile");
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto py-12 px-4 space-y-6 max-w-sm"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Liftfeed</h1>
      </div>
      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-2">
          <Link className="inline-block text-sm underline" href="signup">
            Create an account
          </Link>
          <Link className="inline-block text-sm underline" href="#">
            Forgot your password?
          </Link>
        </div>
      </div>
    </form>
  );
}
