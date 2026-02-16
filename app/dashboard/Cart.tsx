'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

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

  const fetchCart = async () => {
    const storedCart = JSON.parse(localStorage.getItem('Cart') ?? '[]');
    setCart(storedCart);

    if(storedCart.length > 0) {
      const ids = storedCart.map((item: Cart) => item.id);
      const res = await axios.post('api/cart', {
        ids
      });

      setProducts(res.data)
    } else {
      setProducts([])
    }

  }

  const removeCart = () => {
    localStorage.removeItem('Cart');
    setCart([]);
    setProducts([]);
  } 

  const getQty = (id: number) => {
    const item = cart.find((c) => c.id == id)
    return item ? item.qty : 0;
  }

  const updateQty = (id: number, type: "increase" | "decrease") => {
    const storedCart = JSON.parse(localStorage.getItem("Cart") ?? "[]");

    const updateCart = storedCart.map((item: Cart) => {
      if(item.id == id) {
        if(type == "increase") {
          return {...item, qty: item.qty + 1}
        }

        if(type == "decrease") {
          return {...item, qty: item.qty - 1}
        }
      }
      return item
    })
    .filter((item: Cart) => item.qty > 0);

    localStorage.setItem("Cart", JSON.stringify(updateCart));
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const subtotal = products.reduce((total, product) => {
    return total + product.price * getQty(product.id)
  }, 0)

  const promoDiscount = selectedPromo;
  let tax = (subtotal - promoDiscount) * 0.1;
  let totalHarga = subtotal - promoDiscount + tax ;

  if (totalHarga <= 0) {
    tax = 0;
    totalHarga = 0;
  }
  
  const fetchPromo = async () => {
    const res = await axios.get('api/promo');
    setPromos(res.data);
  }

  const handleSubmit = async () => {
    if (cart.length == 0) return alert('Cart Kosong');

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
    // setCart(product ? Number(product) : null

    window.addEventListener('cartUpdated', fetchCart);

    return () => {
      window.removeEventListener('cartUpdated', fetchCart);
    }
  }, [])

  
  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold text-lg mb-4">Cart</h2>

      {products.map((p) => (
        <div key={p.id} className='flex justify-between items-center'>
          <div className='flex gap-3 items-center'>
            <p>{p.name}</p>

            <div className='flex items-center gap-2 mt-1'>
              <button className='border px-2' onClick={() => updateQty(p.id, "decrease")}>-</button>
              <span>{getQty(p.id)}</span>
              <button className='border px-2' onClick={() => updateQty(p.id, "increase")}>+</button>
            </div>
          </div>

          <p>Rp{p.price * getQty(p.id)}</p>
        </div>
      ))}

      <hr className='my-2'/>

      <p>Subtotal: {subtotal}</p>
      <p>Tax 10%: {tax}</p>
      <p>Total: {totalHarga}</p>

      <div>
        <select className='border px-2 py-1 w-full my-2' onChange={(e) => setSelectedPromo(Number(e.target.value))}>
          <option value={0}>No Promo</option>
          {promos.map((promo) => (
            <option key={promo.id} value={promo.discount} className='text-gray-500'>
              {promo.name} (Rp{promo.discount})
            </option>
          ))}
        </select>
      </div>
      
      <button type='button' onClick={handleSubmit} className='border  p-2 rounded mt-4 mr-2'>Order</button>
      <button type='button' onClick={removeCart} className='border  p-2 rounded mt-4'>Clear Cart</button>
    </div>
  );
}
