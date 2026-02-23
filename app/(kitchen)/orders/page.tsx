import { prisma } from "@/lib/prisma";
import UpdateStatus from "./updateStatus";

const getSales = async (search?: string) => {
  const searchNumber = parseFloat(search ?? "");
  return await prisma.sales.findMany({
    where: search ? {
      queue_number: {
        equals: searchNumber,
      }
    } : undefined,

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

const Kitchen = async ({searchParams}: {searchParams?: Promise<{search?: string}>}) => {
    const params = await searchParams;
    const search = params?.search ?? "";
    const sales = await getSales(search);

  return (  
    <div className="p-4 max-w-4xl mx-auto">
      <form className="mb-6" method="GET">
        <input type="text" name="search" defaultValue={search} placeholder="Search queue number..." className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales.map((sale) => (
          <div key={sale.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <span className="font-bold text-lg text-gray-500">Queue #{sale.queue_number}</span>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${sale.status === "pending" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-green-100 text-green-800"
                }
              `}>
                {sale.status === "Pending" ? "Waiting" : "Done"}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Detail Order:</h3>
              <div className="space-y-2">
                {sale.detail_sales.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.product.name}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                      x{item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <UpdateStatus sale={sale} />
            </div>
          </div>
        ))}

        {sales.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            <p className="text-lg">There is no Queue</p>
            <p className="text-sm mt-1">Silahkan cari dengan nomor antrian lain</p>
            <p className="text-sm mt-1">Please search with another queue number</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Kitchen