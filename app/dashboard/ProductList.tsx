'use client';

type Product = {
  id: number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
};

export default function ProductList({ products }: { products: Product[] }) {
  const cartItem = (id: number) => {
    const storedCart = JSON.parse(localStorage.getItem("Cart") ?? "[]");
    const existing = storedCart.find((item: any) => item.id == id) 

    if(existing) {
      existing.qty += 1;
    } else {
      storedCart.push({id: id, qty: 1});
    }

    localStorage.setItem("Cart", JSON.stringify(storedCart));

    window.dispatchEvent(new Event('cartUpdated'))
    // localStorage.setItem("Cart", JSON.stringify(id))
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded" onClick={() => cartItem(product.id)}>
          <h3 className="font-bold">{product.name}</h3>
          <p>Rp {product.price}</p>
          <p className="text-sm text-gray-500">
            {product.category.name}
          </p>
        </div>
      ))}
    </div>
  );
}
