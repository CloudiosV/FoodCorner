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
  const [showPopup, setShowPopup] = useState(false);

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
    setShowPopup(false);
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
      setShowPopup(false);

    } catch (error) {
      alert("Gagal menyimpan order");
    }
  }

  useEffect(() => {
    fetchCart();
    fetchPromo();

    window.addEventListener('cartUpdated', fetchCart);

    return () => {
      window.removeEventListener('cartUpdated', fetchCart);
    }
  }, [])

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Pesanan</h2>
            <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
              {products.length} item
            </span>
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Keranjang kosong</p>
              <p className="text-sm mt-2">Tap menu untuk menambah</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-500">Rp {p.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-lg font-bold text-red-600 touch-manipulation active:bg-gray-300" onClick={() => updateQty(p.id, "decrease")}>
                      -
                    </button>
                    <span className="w-6 text-center font-medium">{getQty(p.id)}</span>
                    <button className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-lg font-bold text-blue-600 touch-manipulation active:bg-blue-300" onClick={() => updateQty(p.id, "increase")}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-500">Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diskon:</span>
                <span className="font-medium text-green-600">- Rp {promoDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax 10%:</span>
                <span className="font-medium text-red-500">Rp {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span className='text-gray-600'>Total:</span>
                <span className="text-blue-600">Rp {totalHarga.toLocaleString()}</span>
              </div>
            </div>

            <select className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-sm touch-manipulation bg-white text-gray-600" onChange={(e) => setSelectedPromo(Number(e.target.value))} value={selectedPromo}>
              <option value={0}>Pilih Promo</option>
              {promos.map((promo) => (
                <option key={promo.id} value={promo.discount}>
                  {promo.name} - Rp{promo.discount}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <button type='button' onClick={() => setShowPopup(true)} className="py-3 bg-green-600 text-white rounded-lg font-medium touch-manipulation active:bg-green-700">
                Bayar
              </button>
              <button type='button' onClick={removeCart} className="py-3 bg-gray-200 text-gray-700 rounded-lg font-medium touch-manipulation active:bg-gray-300">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowPopup(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4 text-gray-600">Konfirmasi Pembayaran</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-500">Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Diskon:</span>
                <span className="font-medium text-green-600">- Rp {promoDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax 10%:</span>
                <span className="font-medium text-red-500">Rp {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-xl font-bold">
                <span className='text-gray-600'>Total:</span>
                <span className="text-blue-600">Rp {totalHarga.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowPopup(false)} className="py-3 bg-gray-200 text-gray-700 rounded-lg font-medium touch-manipulation active:bg-gray-300">
                Batal
              </button>
              <button onClick={handleSubmit} className="py-3 bg-blue-600 text-white rounded-lg font-medium touch-manipulation active:bg-blue-700">
                Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}