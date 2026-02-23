'use client';
import { useState, SyntheticEvent } from "react";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddProduct = ({categories}: {categories: Category[]}) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const route = useRouter();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("category_id", category);
        if(image) {
          formData.append("image", image);
        }

        await axios.post('/api/products', formData, {
          headers: {"Content-Type": "multipart/form-data"}
        });

        setName("");
        setPrice("");
        setCategory("");
        setImage(null);
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
            <h3 className="font-bold text-lg mb-4">Add New Product</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block font-bold mb-1">Product Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Product Name"/>
              </div>

              <div className="mb-3">
                <label className="block font-bold mb-1">Price</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Price"/>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="" disabled>
                    Please select a category
                  </option>
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full"/>
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

export default AddProduct