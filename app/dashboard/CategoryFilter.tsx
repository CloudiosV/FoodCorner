'use client'

import type { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleFilter = (id?: number) => {
    if (!id) {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard?category=${id}`);
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button variant={!currentCategory ? "default" : "outline"} size="sm" onClick={() => handleFilter()} className="rounded-full">
          Semua Menu
        </Button>

        {categories.map((cat) => (
          <Button key={cat.id} variant={currentCategory == String(cat.id) ? "default" : "outline"} size="sm" onClick={() => handleFilter(cat.id)} className="rounded-full">
            {cat.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}