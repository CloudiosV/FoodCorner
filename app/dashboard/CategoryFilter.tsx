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
    <div className="flex gap-2 overflow-x-auto pb-2 touch-pan-x">
      <button 
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-manipulation
          ${!currentCategory 
            ? "bg-blue-600 text-white shadow-md" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`} 
        onClick={() => handleFilter()}>
        Semua Menu
      </button>

      {categories.map((cat) => (
        <button 
          key={cat.id} 
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-manipulation
            ${currentCategory == String(cat.id) 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`} 
          onClick={() => handleFilter(cat.id)}>
          {cat.name}
        </button>
      ))}
    </div>
  )
}