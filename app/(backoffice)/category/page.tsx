import { prisma } from "@/lib/prisma";
import AddCategory from "./addCategory";
import DeleteCategory from "./deleteCategory";
import UpdateCategory from "./updateCategory";

const getCategory = async (search?: string) => {
  return prisma.category.findMany({
    where: search? {
      name: {
        contains: search,
        mode: "insensitive"
      }
    } :undefined,

    select: {
      id: true,
      name: true,
    },
  });
};

const Category = async ({searchParams}: {searchParams?: Promise<{search?: string}>}) => {
  const params = await searchParams;
  const search = params?.search ?? "";
  const category = await getCategory(search);

  return (
    <div>
      <div className="mb-2">
        <AddCategory />
      </div>

      <form className="mb-3" method="GET">
        <input type="text" name="search" defaultValue={search} placeholder="Search Category..." className="border px-3 py-2 rounded w-64"/> 
      </form>

      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {category.map((cater, index) => (
            <tr key={cater.id}>
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{cater.name}</td>
              <td className="border px-3 py-2 text-center flex gap-2 justify-center">
                <UpdateCategory category={cater} />
                <DeleteCategory category={cater} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
