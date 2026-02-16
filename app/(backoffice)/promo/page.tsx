import { prisma } from "@/lib/prisma";
import AddPromo from "./addPromo";
import DeletePromo from "./deletePromo";
import UpdatePromo from "./updatePromo";

const getPromo = async (search?: string) => {
  return prisma.promo.findMany({
  where: search
  ? {
    name: {
      contains: search,
      mode: "insensitive"
    }
  } :undefined,

    select: {
      id: true,
      discount: true,
      name: true,
    },
  });
};

const Promo = async ({searchParams}: {searchParams?: Promise<{search?: string}> }) => {
  const params = await searchParams;
  const search = params?.search ?? "";
  const promos = await getPromo(search);

  return (
    <div>
      <div className="mb-2">
        <AddPromo/>
      </div>

      <form className="mb-3" method="GET">
        <input type="text" name="search" defaultValue={search} placeholder="Search Promo..." className="border px-3 py-2 rounded w-64"/> 
      </form>

      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Discount</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo, index) => (
            <tr key={promo.id}>
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{promo.name}</td>
              <td className="border px-3 py-2">{promo.discount}</td>
              <td className="border px-3 py-2 text-center flex gap-2 justify-center">
                <UpdatePromo promo={promo} />
                <DeletePromo promo={promo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Promo;
