'use client';
import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddCategory = () => {
    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const route = useRouter();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        await axios.post('/api/category', {
            name: name,
        })
        setName("");
        route.refresh();
        setIsOpen(false);
    }

    const handleModal = () => {
        setIsOpen(!isOpen);
    }
  return (  
    <div>
      <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={handleModal}>
        Add New
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-gray-600">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h3 className="font-bold text-lg mb-4">Add New Category</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block font-bold mb-1">Category Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Product Name"/>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={handleModal}>
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCategory