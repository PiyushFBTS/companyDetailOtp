"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider"
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function Home() {
  const { user } = useAuth();
  console.log("user", user);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 w-full max-w-md text-center">
        {user ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome, you are logged in
            </h1>
            <p className="text-green-600 font-medium">Login Successful</p>
          </>
        ) : (
          <h1 className="text-xl font-medium text-red-600">You are not logged in</h1>
        )}

        <div className="mt-8">
          {user ? (
            <Button
              onClick={() => signOut(auth)}
              className="w-full"
              variant="destructive"
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/login" passHref>
              <Button className="w-full" variant="default">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
