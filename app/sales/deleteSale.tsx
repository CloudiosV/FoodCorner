'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Sales = {
    id: number;
    total_price: number;
    discount: number;
    final_price: number;
}

const DeleteSale = ({sale}: {sale: Sales}) => {
    const [isOpen, setIsOpen] = useState(false);

    const route = useRouter();

    const handleDelete = async (sale_id: number) => {
        await axios.delete(`/api/sales/${sale_id}`)
        route.refresh();
        setIsOpen(false);
    }

    const handleModal = () => {
        setIsOpen(!isOpen);
    }
  return (  
    <div>
      <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleModal}>
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-gray-600">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h3 className="font-bold text-lg mb-4">Are you sure to delete this data?</h3>

              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={handleModal}>
                  No
                </button>
                <button type="button" onClick={() => handleDelete(sale.id)} className="px-4 py-2 bg-blue-600 text-white rounded">
                  Yes
                </button>
              </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default DeleteSale