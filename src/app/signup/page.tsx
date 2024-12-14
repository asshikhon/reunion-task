"use client";

import React, { FormEvent, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react"; // Import the signIn function
import { useRouter } from "next/navigation";

// Define the type for the user object
interface NewUser {
  name: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const newUser: NewUser = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      // Call your API route to create a new user
      const resp = await fetch("/signup/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (resp.ok) {
        // Automatically sign in the user after successful signup
        const signInResponse = await signIn("credentials", {
          redirect: false,
          email: newUser.email,
          password: newUser.password,
        });

        if (signInResponse?.ok) {
          router.push("/"); // Redirect to the home page after successful signup
        } else {
          setError("Sign-in failed. Please try logging in manually.");
        }
      } else {
        const errorData = await resp.json();
        setError(errorData.message || "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Error occurred while creating the account.");
    }
  };

  return (
    <div className="container mx-auto my-24">
      <div className="flex justify-around flex-col md:flex-row gap-14">
        <div></div>
        <div className="border rounded-xl p-14 w-[610px]">
          <h2 className="text-3xl font-bold text-center mb-16">SignUp</h2>
          <form onSubmit={handleSignUp}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <label htmlFor="name" className="font-bold">
              Name
            </label>
            <br />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="input mt-3 mb-4 input-bordered w-full"
            />
            <br />
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <br />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              className="input mt-3 mb-4 input-bordered w-full"
            />
            <br />
            <label htmlFor="password" className="font-bold">
              Confirm Password
            </label>
            <br />
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              className="input mt-3 input-bordered w-full"
            />
            <br />
            <button type="submit" className="btn btn-primary w-full text-white mt-8">
              Sign Up
            </button>
          </form>
          <div className="text-center space-y-6 mt-8">
            <h6>or sign in with</h6>
            <div className="flex items-center gap-4 text-center justify-center">
              <button className="btn bg-transparent btn-outline">
                <FcGoogle className="text-3xl" />
              </button>

              <button className="btn bg-transparent btn-outline">
                <FaGithub className="text-3xl" />
              </button>
            </div>
            <h6>
              Already have an account?{" "}
              <Link href={`/login`} className="underline text-blue-700">
                Login
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
