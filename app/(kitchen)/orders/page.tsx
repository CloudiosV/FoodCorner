import { prisma } from "@/lib/prisma";
import UpdateStatus from "./updateStatus";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Utensils } from "lucide-react";

const getSales = async () => {
  return await prisma.sales.findMany({
    where: {
      status: {
        not: "done"
      }
    },
    include: {
      detail_sales: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      queue_number: 'asc'
    }
  })
}

const Kitchen = async () => {
    const sales = await getSales();

    return (  
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Utensils className="h-6 w-6"/>
                    Kitchen Queue
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage and track order progress
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sales.map((sale) => (
                    <Card key={sale.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">Queue #{sale.queue_number}</span>
                            </div>
                            <Badge variant={sale.status === "pending" ? "secondary" : "default"}>
                                {sale.status === "pending" ? "Waiting" : "Processing"}
                            </Badge>
                        </CardHeader>

                        <CardContent className="p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">
                                Order Details:
                            </h3>
                            <div className="space-y-2">
                                {sale.detail_sales.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="text-foreground">{item.product.name}</span>
                                        <Badge variant="outline" className="ml-2">
                                            x{item.qty}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>

                        <Separator/>

                        <CardFooter className="p-4">
                            <UpdateStatus sale={sale} />
                        </CardFooter>
                    </Card>
                ))}

                {sales.length === 0 && (
                  <Card className="col-span-full">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                          <div className="rounded-full bg-muted p-3 mb-4">
                              <Clock className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-medium text-center">No Queue Available</p>
                          <p className="text-sm text-muted-foreground text-center mt-1 max-w-sm">
                              All orders have been completed. New orders will appear here when customers place them.
                          </p>
                      </CardContent>
                  </Card>
                )}
            </div>
        </div>
    )
}

export default Kitchen