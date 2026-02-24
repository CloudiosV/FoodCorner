import { prisma } from "@/lib/prisma";
import AddCategory from "./addCategory";
import DeleteCategory from "./deleteCategory";
import UpdateCategory from "./updateCategory";
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

const getCategory = async (search?: string) => {
  return prisma.category.findMany({
    where: search ? {
      name: {
        contains: search,
        mode: "insensitive"
      }
    } : undefined,
    select: {
      id: true,
      name: true,
    },
  });
};

const Category = async ({ searchParams }: { searchParams?: Promise<{ search?: string }> }) => {
  const params = await searchParams;
  const search = params?.search ?? "";
  const categories = await getCategory(search);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <AddCategory />
      </CardHeader>

      <CardContent>
        <form method="GET" className="mb-4">
          <Input 
            type="text" 
            name="search" 
            defaultValue={search} 
            placeholder="Search categories..." 
            className="max-w-sm"
          />
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <UpdateCategory category={category} />
                      <DeleteCategory category={category} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Category;