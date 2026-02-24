// app/products/page.tsx
import { prisma } from "@/lib/prisma";
import AddProduct from "./addProduct";
import DeleteProduct from "./deleteProduct";
import UpdateProduct from "./updateProduct";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getProducts = async (search?: string) => {
  return await prisma.product.findMany({
    where: search ? {
      name: {
        contains: search,
        mode: "insensitive"
      }
    } : undefined,
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

const Product = async ({ searchParams }: { searchParams?: Promise<{ search?: string }> }) => {
  const params = await searchParams;
  const search = params?.search ?? "";

  const [products, categories] = await Promise.all([
    getProducts(search),
    getCategory(),
  ]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <AddProduct categories={categories} />
      </CardHeader>
      <CardContent>
        <form method="GET" className="mb-4">
          <Input type="text" name="search" defaultValue={search} placeholder="Search products..." className="max-w-sm"/>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    {product.image && (
                      <img src={`/uploads/${product.image}`} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <UpdateProduct categories={categories} product={product} />
                      <DeleteProduct product={product} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default Product