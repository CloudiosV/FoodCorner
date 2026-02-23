"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center gap-6 w-full h-screen">
      <div onClick={() => router.push("/dashboard")} className="bg-white w-48 h-48 rounded-xl shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-blue-500">
        <h1 className="text-2xl font-semibold text-gray-800">Guest</h1>
      </div>

      <div onClick={() => router.push("/sales")} className="bg-white w-48 h-48 rounded-xl shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-green-500">
        <h1 className="text-2xl font-semibold text-gray-800">Admin</h1>
      </div>

      <div onClick={() => router.push("/orders")} className="bg-white w-48 h-48 rounded-xl shadow-lg flex flex-col justify-center items-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-yellow-500">
        <h1 className="text-2xl font-semibold text-gray-800">Kitchen</h1>
      </div>
    </div>
  );
}