'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
}

type Cart = {
  id: number;
  qty: number;
}

export default function Cart() {
  const [cart, setCart] = useState<Cart[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);

  const fetchCart = async () => {
    const storedCart = JSON.parse(localStorage.getItem('Cart') ?? '[]');
    setCart(storedCart);

    if(storedCart.length > 0) {
      const ids = storedCart.map((item: Cart) => item.id);
      const res = await axios.post('api/cart', { ids });
      setProducts(res.data)
    } else {
      setProducts([])
    }
  }

  const removeCart = () => {
    localStorage.removeItem('Cart');
    setCart([]);
    setProducts([]);
    setShowPopup(false);
    window.dispatchEvent(new Event("cartUpdated"));
  } 

  const getQty = (id: number) => {
    const item = cart.find((c) => c.id == id)
    return item ? item.qty : 0;
  }

  const updateQty = (id: number, type: "increase" | "decrease") => {
    const storedCart = JSON.parse(localStorage.getItem("Cart") ?? "[]");

    const updateCart = storedCart.map((item: Cart) => {
      if(item.id == id) {
        if(type == "increase") return {...item, qty: item.qty + 1}
        if(type == "decrease") return {...item, qty: item.qty - 1}
      }
      return item
    }).filter((item: Cart) => item.qty > 0);

    localStorage.setItem("Cart", JSON.stringify(updateCart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  const subtotal = products.reduce((total, product) => {
    return total + product.price * getQty(product.id)
  }, 0)

  const promoDiscount = selectedPromo;
  let tax = (subtotal - promoDiscount) * 0.1;
  let totalHarga = subtotal - promoDiscount + tax;

  if (totalHarga <= 0) {
    tax = 0;
    totalHarga = 0;
  }
  
  const fetchPromo = async () => {
    const res = await axios.get('api/promo');
    setPromos(res.data);
  }

  const handleSubmit = async () => {
    if (cart.length == 0) {
      alert('Cart Kosong');
      return;
    }

    try {
      await axios.post('api/sales', {
        cart: cart,
        subtotal: subtotal,
        discount: promoDiscount,
        final_price: totalHarga
      });

      alert("Order berhasil!");
      removeCart();
    } catch (error) {
      alert("Gagal menyimpan order");
    }
  }

  useEffect(() => {
    fetchCart();
    fetchPromo();

    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, []);

  return (
    <>
      <Card className="flex flex-col h-full lg:max-h-[65vh] max-h-[45vh]">
        <CardHeader className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="font-bold text-lg">Pesanan</h2>
            </div>
            <Badge variant="secondary" className="bg-white text-primary">
              {products.length} item
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Keranjang kosong</p>
              <p className="text-sm mt-2">Tap menu untuk menambah</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rp {p.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="outline" size="icon" className="h-8 w-8 touch-manipulation" onClick={() => updateQty(p.id, "decrease")}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center font-medium">{getQty(p.id)}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 touch-manipulation" onClick={() => updateQty(p.id, "increase")}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {products.length > 0 && (
          <CardFooter className="flex-col px-4 bg-muted/50 border-t sticky bottom-0">
            <div className="w-full space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diskon:</span>
                <span className="font-medium text-green-600">- Rp {promoDiscount.toLocaleString()}</span>
              </div>
              <div className="hidden lg:flex justify-between">
                <span className="text-muted-foreground">Tax 10%:</span>
                <span className="font-medium text-destructive">Rp {tax.toLocaleString()}</span>
              </div>
              <div className="hidden lg:flex justify-between text-lg font-bold pt-2 border-t">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-primary">Rp {totalHarga.toLocaleString()}</span>
              </div>
            </div>

            <Select onValueChange={(value) => setSelectedPromo(Number(value))} value={String(selectedPromo)}>
              <SelectTrigger className="w-full mb-3 touch-manipulation">
                <SelectValue placeholder="Pilih Promo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Pilih Promo</SelectItem>
                {promos.map((promo) => (
                  <SelectItem key={promo.id} value={String(promo.discount)}>
                    {promo.name} - Rp {promo.discount.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button type="button" onClick={() => setShowPopup(true)} className="w-full touch-manipulation">
                Bayar
              </Button>
              <Button type="button" variant="outline" onClick={removeCart} className="w-full gap-2 touch-manipulation">
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Diskon:</span>
              <span className="font-medium text-green-600">- Rp {promoDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Tax 10%:</span>
              <span className="font-medium text-destructive">Rp {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-xl font-bold">
              <span className="text-muted-foreground">Total:</span>
              <span className="text-primary">Rp {totalHarga.toLocaleString()}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowPopup(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              Bayar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}