"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Dashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession(); // Get the user session
  const router = useRouter();

console.log(session);


  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login"); // Redirect to login after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">TaskManager</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link href="/dashboard" className="text-white hover:text-blue-400">
            Dashboard
          </Link>
          <Link href="/task-list" className="text-white hover:text-blue-400">
            Task List
          </Link>

          {/* Conditional Sign In / Sign Out */}
          {session ? (
            <button
              onClick={handleSignOut}
              className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
          <Link
            href="/"
            className="text-white hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/task-list"
            className="text-white hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Task List
          </Link>

          {/* Conditional Sign In / Sign Out */}
          {session ? (
            <button
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Dashboard;
