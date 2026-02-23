// import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
// import {}

// const prisma = new PrismaClient();

const getProducts = async (search?: string) => {
  return await prisma.product.findMany({
    where: search? {
      name: {
        contains: search,
        mode: "insensitive"
      }
    } :undefined,

    select: {
      id: true,
      name: true,
      price: true,
      category_id: true,
      image: true,
      category: {
        select: {
          id: true,
          name: true,
        }
      }
    },
  })
}

const getCategory = async () => {
  return await prisma.category.findMany();
}

const Product = async ({searchParams}: {searchParams?: Promise<{ search?: string }>}) => {
  const params = await searchParams;
  const search = params?.search ?? "";

  const [products, categories] = await Promise.all([
    getProducts(search),
    getCategory(),
  ]);

  return (
    <div>
      <div className="mb-2">
        <AddProduct categories={categories}/>
      </div>

      <form className="mb-3" method="GET">
        <input type="text" name="search" defaultValue={search} placeholder="Search Product..." className="border px-3 py-2 rounded w-64"/> 
      </form>

      <table className="w-full border border-gray-300 border-collapse">
        <thead className="">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Price</th>
            <th className="border px-3 py-2 text-left">Category</th>
            <th className="border px-3 py-2 text-left">Image</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{product.name}</td>
              <td className="border px-3 py-2">{product.price}</td>
              <td className="border px-3 py-2">{product.category.name}</td>
              <td className="border px-3 py-2">
                {product.image && (
                  <img src={`/uploads/${product.image}`} alt={product.name} className="w-16   h-16 object-cover rounded"/>
                )}
              </td>
              <td className="border px-3 py-2 text-center flex gap-2 justify-center">
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
