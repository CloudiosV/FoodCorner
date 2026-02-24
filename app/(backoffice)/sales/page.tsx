import { prisma } from "@/lib/prisma";
import DeleteSale from "./deleteSale";
import DetailSale from "./detailSale";
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
import { format } from "date-fns";

const getSales = async (search?: string) => {
  const searchNumber = parseFloat(search ?? "");
  return await prisma.sales.findMany({
    where: search ? {
      final_price: {
        equals: searchNumber,
      }
    } : undefined,
    select: {
      id: true,
      total_price: true,
      discount: true,
      final_price: true,
      created_at: true
    },
    orderBy: {
      created_at: 'desc'
    }
  })
}

const Sales = async ({ searchParams }: { searchParams?: Promise<{ search?: string }> }) => {
  const params = await searchParams;
  const search = params?.search ?? "";
  const sales = await getSales(search);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales List</CardTitle>
      </CardHeader>

      <CardContent>
        <form method="GET" className="mb-4">
          <Input 
            type="text" 
            name="search" 
            defaultValue={search} 
            placeholder="Search by final price..." 
            className="max-w-sm"
          />
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale, index) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>Rp {sale.total_price.toLocaleString()}</TableCell>
                  <TableCell>{sale.discount}%</TableCell>
                  <TableCell>Rp {sale.final_price.toLocaleString()}</TableCell>
                  <TableCell>{format(new Date(sale.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <DetailSale sale={sale} />
                      <DeleteSale sale={sale} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No sales found
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

export default Sales;