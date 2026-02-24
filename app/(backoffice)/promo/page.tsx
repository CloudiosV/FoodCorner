import { prisma } from "@/lib/prisma";
import AddPromo from "./addPromo";
import DeletePromo from "./deletePromo";
import UpdatePromo from "./updatePromo";
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

const getPromo = async (search?: string) => {
  return prisma.promo.findMany({
    where: search ? {
      name: {
        contains: search,
        mode: "insensitive"
      }
    } : undefined,
    select: {
      id: true,
      name: true,
      discount: true,
    },
  });
};

const Promo = async ({ searchParams }: { searchParams?: Promise<{ search?: string }> }) => {
  const params = await searchParams;
  const search = params?.search ?? "";
  const promos = await getPromo(search);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Promos</CardTitle>
        <AddPromo />
      </CardHeader>

      <CardContent>
        <form method="GET" className="mb-4">
          <Input 
            type="text" 
            name="search" 
            defaultValue={search} 
            placeholder="Search promos..." 
            className="max-w-sm"
          />
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Discount (%)</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((promo, index) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{promo.name}</TableCell>
                  <TableCell>{promo.discount}%</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <UpdatePromo promo={promo} />
                      <DeletePromo promo={promo} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {promos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No promos found
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

export default Promo;