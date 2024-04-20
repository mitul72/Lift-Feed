"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { z } from "zod";
import { User } from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface contextType {
  user: User | null;
  gitHubSignIn: () => void;
  firebaseSignOut: () => void;
  handleSignUp: (name: string, email: string, password: string) => void;
  handleSignIn: (email: string, password: string) => void;
}

const AuthContext = createContext<contextType>({
  user: null,
  gitHubSignIn: () => {},
  firebaseSignOut: () => {},
  handleSignUp: (name: string, email: string, password: string) => {},
  handleSignIn: (email: string, password: string) => {},
});

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      // Validate user input
      signUpSchema.parse({ name, email, password });

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      console.log("Sign up successful");
      toast.success("Account created successfully");
      router.push("/profile");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        error.errors.forEach((err) => {
          console.error(err.message);
        });
      } else {
        console.error(error.message);
        toast.error(error.message);
      }
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      // Validate user input
      signInSchema.parse({ email, password });

      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);

      console.log("Sign in successful");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const gitHubSignIn = () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const firebaseSignOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        gitHubSignIn,
        firebaseSignOut,
        handleSignUp,
        handleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
