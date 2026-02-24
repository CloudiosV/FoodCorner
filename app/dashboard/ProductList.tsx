'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: {
    id: number;
    name: string;
  };
};

export default function ProductList({ products }: { products: Product[] }) {
  const cartItem = (id: number) => {
    const storedCart = JSON.parse(localStorage.getItem("Cart") ?? "[]");
    const existing = storedCart.find((item: any) => item.id == id);

    if (existing) {
      existing.qty += 1;
    } else {
      storedCart.push({ id: id, qty: 1 });
    }

    localStorage.setItem("Cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95" onClick={() => cartItem(product.id)}>
          <div className="aspect-square bg-muted">
            {product.image ? (
              <img src={`/uploads/${product.image}`} alt={product.name} className="w-full h-full object-cover"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🍽️
              </div>
            )}
          </div>

          <CardContent className="p-3">
            <h3 className="font-semibold text-sm md:text-base line-clamp-1">
              {product.name}
            </h3>
            <p className="text-primary font-bold text-sm md:text-base mt-1">
              Rp {product.price.toLocaleString()}
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {product.category.name}
            </Badge>
          </CardContent>

          <CardFooter className="p-0">
            <Button variant="ghost" className="w-full rounded-none border-t h-8 text-xs gap-1" onClick={(e) => {e.stopPropagation(); cartItem(product.id);}}>
              <Plus className="h-3 w-3" />
              Tap to add
            </Button>
          </CardFooter>
        </Card>
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-lg">Tidak ada menu</p>
          <p className="text-sm mt-1">Silahkan pilih kategori lain</p>
        </div>
      )}
    </div>
  );
}