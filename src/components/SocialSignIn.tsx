"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SocialSignIn: React.FC = () => {
  const router = useRouter();
  const { status } = useSession(); // Only use `status` to check if authenticated

  const handleSocialLogin = async (provider: string) => {
    try {
      console.log("called");
      const resp = await signIn(provider, { redirect: false });
      if (resp?.error) {
        console.error("Social login failed:", resp.error);
      }
    } catch (error) {
      console.error("Error during social login:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect if authenticated
    }
  }, [status, router]);

  return (
    <div>
      <div className="mt-4">
        <p className="text-center text-sm text-gray-600">Or sign in with</p>
        <div className="flex justify-center space-x-4 mt-3">
          <button
            onClick={() => handleSocialLogin("google")}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <i className="fab fa-google"></i>
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialSignIn;
