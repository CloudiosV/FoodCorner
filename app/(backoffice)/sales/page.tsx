import { prisma } from "@/lib/prisma";
import DeleteSale from "./deleteSale";
import DetailSale from "./detailSale";

const getSales = async (search?: string) => {
  const searchNumber = parseFloat(search ?? "");
  return await prisma.sales.findMany({
    where: search? {
      final_price: {
        equals: searchNumber,
      }
    } :undefined,

    select: {
      id: true,
      total_price: true,
      discount: true,
      final_price: true,
      created_at: true
    },
  })
}

const Sales = async ({searchParams}: {searchParams?: Promise<{ search?: string }>}) => {
  const params = await searchParams;
  const search = params?.search ?? "";
  const sales = await getSales(search);

  return (
    <div>
      <h1>Sales List</h1>

      <form className="mb-3" method="GET">
        <input type="text" name="search" defaultValue={search} placeholder="Search sales..." className="border px-3 py-2 rounded w-64"/> 
      </form>

      <table className="w-full border border-gray-300 border-collapse">
        <thead className="">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Total_Price</th>
            <th className="border px-3 py-2 text-left">Discount</th>
            <th className="border px-3 py-2 text-left">Final_Price</th>
            <th className="border px-3 py-2 text-left">Created_At</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{sale.total_price}</td>
              <td className="border px-3 py-2">{sale.discount}</td>
              <td className="border px-3 py-2">{sale.final_price}</td>
              <td className="border px-3 py-2">{sale.created_at.toString()}</td>
              <td className="border px-3 py-2 text-center flex gap-2 justify-center">
                <DeleteSale sale={sale}/>
                <DetailSale sale={sale}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sales