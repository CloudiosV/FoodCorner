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

type DetailItem = {
    id : number;
    qty: number;
    price: number;
    product: {
        name: string;
    }
}

const DetailSale = ({sale}: {sale: Sales}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState<DetailItem[]>([])

    const handleModal = async () => {
        if(!isOpen) {
            const res = await axios.get(`api/sales/${sale.id}`)
            setDetails(res.data.detail_sales)
        }

        setIsOpen(!isOpen);
    }
  return (  
    <div>
      <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={handleModal}>
        Detail
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-gray-600">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h3 className="font-bold text-lg mb-4">Detail Data {sale.id}</h3>

                {details.map((item) => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.product.name} x{item.qty}</span>

                        <span>{item.price * item.qty}</span>
                    </div>
                ))}

                <hr className="my-3"/>

                <div className="flex justify-between">
                    <span>Discount</span>
                    <span>{sale.discount}</span>
                </div>

                <div className="flex justify-between">
                    <span>Total</span>
                    <span>{sale.final_price}</span>
                </div>

                <button type="button" className="px-4 py-2 border rounded" onClick={handleModal}>
                  Close
                </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailSale