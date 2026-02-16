'use client'

import type { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter({categories}: {categories: Category[]}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category');

  const handleFilter = (id?: number) => {
    if(!id) {
      router.push('/dashboard')
    }
    else {
      router.push(`/dashboard?category=${id}`)
    }
  }

  return (  
    <div className="flex gap-2">
      <button className={`px-3 py-1 rounded ${!currentCategory ? "bg-gray-800 text-white" : "border"}`} onClick={() => handleFilter()}>All</button>

      {categories.map((cat) => (
        <button key={cat.id} className={`px-3 py-1 rounded ${currentCategory == String(cat.id) ? "bg-gray-800 text-white" : "border"}`} onClick={() => handleFilter(cat.id)}>{cat.name}</button>
      ))}
    </div>
  )
}
