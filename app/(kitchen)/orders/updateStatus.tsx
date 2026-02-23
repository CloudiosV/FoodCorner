'use client';
import { useRouter } from "next/navigation";
import axios from "axios";

type Sale = {
  id: number;
  status: string;
  queue_number: number;
}

const UpdateStatus = ({ sale }: { sale: Sale }) => {
  const router = useRouter();

  const handleDone = async () => {
    try {
      await axios.patch(`/api/kitchen/${sale.id}`, {
        status: "done"
      });
      router.refresh();
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal mengupdate status");
    }
  };

  if (sale.status === "done") {
    return null;
  }

  return (
    <button onClick={handleDone} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400">
      Done
    </button>
  )
}

export default UpdateStatus