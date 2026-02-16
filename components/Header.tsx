"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="bg-black text-white p-4 flex gap-6">
      <Link href="/sales">Sales</Link>
      <Link href="/products">Products</Link>
      <Link href="/category">Category</Link>
      <Link href="/promo">Promo</Link>
    </header>
  );
}