'use client';
import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Promo = {
  id: number;
  name: string;
  discount: number;
}

const UpdatePromo = ({promo}: {promo: Promo}) => {
    const [name, setName] = useState(promo.name);
    const [discount, setDiscount] = useState(promo.discount);
    const [isOpen, setIsOpen] = useState(false);

    const route = useRouter();

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault();
        await axios.patch(`/api/promo/${promo.id}`, {
            name: name,
            discount: Number(discount),
        });
        route.refresh();
        setIsOpen(false);
    }

    const handleModal = () => {
        setIsOpen(!isOpen);
    }
  return (  
    <div>
      <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={handleModal}>
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-gray-600">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h3 className="font-bold text-lg mb-4">Update {promo.name}</h3>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="block font-bold mb-1">Promo Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Promo Name"/>
              </div>

              <div className="mb-3">
                <label className="block font-bold mb-1">Discount</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full border rounded px-3 py-2" placeholder="Promo Discount"/>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={handleModal}>
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePromo