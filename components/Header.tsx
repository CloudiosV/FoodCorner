"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
    return null;
  }

  const handleLogout = () => {
    signOut({callbackUrl: "/login"});
  }

  return (
    <header className="bg-black text-white p-4 flex gap-6">
      <div className="flex gap-4">
        <Link href="/sales">Sales</Link>
        <Link href="/products">Products</Link>
        <Link href="/category">Category</Link>
        <Link href="/promo">Promo</Link>
      </div>

      <button onClick={handleLogout} className="ml-auto text-red-400">Logout</button>
    </header>
  );
}