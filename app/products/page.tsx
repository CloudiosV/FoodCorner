// import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/product/get";
// import {}

// const prisma = new PrismaClient();

const getProducts = async () => {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
  })
}

const Product = async () => {
  const products = await getProducts()

  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Product
