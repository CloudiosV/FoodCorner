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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Menu Makanan</h1>
            <CategoryFilter categories={categories} />
          </div>
          <ProductList products={products} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  )
}