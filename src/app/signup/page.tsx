"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

// Define the type for the new user
interface NewUser {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session status
  const [loading, setLoading] = useState(true); // to handle loading state for session check

console.log(session);
console.log(status);

  // Redirect authenticated users to the home page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect if already logged in
    } else {
      setLoading(false); // Stop loading if session status is checked
    }
  }, [status, router]);

  // Handle sign up form submission
  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Assert that event.target is an HTMLFormElement
    const form = event.target as HTMLFormElement;

    // Extract values from the form
    const newUser: NewUser = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    try {
      const resp = await fetch("/signup/api", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 200) {
        const loginResp = await signIn("credentials", {
          email: newUser.email,
          password: newUser.password,
          redirect: false,
        });

        if (loginResp?.status === 200) {
          router.push("/"); // Redirect to home on successful login
        }
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  // If the page is still checking session, return a loading screen
  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('https://i.ibb.co/c6KyHys/travel-concept-with-landmarks-1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Create an Account</h2>
        <form onSubmit={handleSignUp} className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="********"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
