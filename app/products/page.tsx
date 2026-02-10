// import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
// import {}

// const prisma = new PrismaClient();

const getProducts = async () => {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      category_id: true
    },
  })
}

const getCategory = async () => {
  return await prisma.category.findMany();
}

const Product = async () => {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategory()
  ]);

  return (
    <div>
      <div className="mb-2">
        <AddProduct categories={categories}/>
      </div>

      <table className="w-full border border-gray-300 border-collapse">
        <thead className="">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Price</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{product.name}</td>
              <td className="border px-3 py-2">{product.price}</td>
              <td className="border px-3 py-2 text-center">
                <UpdateProduct categories={categories} product={product}/>
                <DeleteProduct product={product}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Product
