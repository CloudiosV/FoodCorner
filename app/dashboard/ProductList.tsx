'use client';

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
    const existing = storedCart.find((item: any) => item.id == id) 

    if(existing) {
      existing.qty += 1;
    } else {
      storedCart.push({id: id, qty: 1});
    }

    localStorage.setItem("Cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {products.map((product) => (
        <div key={product.id} onClick={() => cartItem(product.id)} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 active:scale-95 transition-transform duration-150 touch-manipulation cursor-pointer hover:shadow-md">
          <div className="aspect-square bg-gray-100">
            {product.image ? (
              <img src={`/uploads/${product.image}`} alt={product.name} className="w-full h-full object-cover"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">🍽️</span>
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
              {product.name}
            </h3>
            <p className="text-blue-600 font-bold text-sm md:text-base mt-1">
              Rp {product.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded-full">
              {product.category.name}
            </p>
          </div>

          <div className="bg-blue-50 py-2 text-center text-blue-600 text-xs font-medium border-t border-blue-100">
            Tap to add
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-lg">Tidak ada menu</p>
          <p className="text-sm mt-1">Silahkan pilih kategori lain</p>
        </div>
      )}
    </div>
  );
}