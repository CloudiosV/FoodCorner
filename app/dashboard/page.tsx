import { prisma } from "@/lib/prisma"
import CategoryFilter from "./CategoryFilter"
import ProductList from "./ProductList"
import Cart from "./Cart"

const getCategories = async () => {
  return prisma.category.findMany()
}

const getProducts = async (category?: string) => {
  return prisma.product.findMany({
    where: category? {
      category_id: parseInt(category)
    } :undefined,

    include: {
      category: true,
    },
  })
}

export default async function DashboardPage({searchParams}: {searchParams?: Promise<{category?: string}>}) {
  const params = await searchParams;
  const search = params?.category ?? "";
  const categories = await getCategories()
  const products = await getProducts(search)

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <CategoryFilter categories={categories} />
        <ProductList products={products} />
      </div>

      <Cart/>
    </div>
  )
}
