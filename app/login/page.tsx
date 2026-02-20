"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/sales");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 w-80 text-center">
        <h1 className="text-xl mb-4">Login</h1>

        <button
          onClick={() => signIn("google", { callbackUrl: "/sales" })}
          className="bg-red-500 text-white w-full p-2"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}