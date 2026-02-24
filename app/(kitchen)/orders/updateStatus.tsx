'use client';
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

type Sale = {
    id: number;
    status: string;
    queue_number: number;
}

const UpdateStatus = ({ sale }: { sale: Sale }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDone = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/kitchen/${sale.id}`, {
                status: "done"
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (sale.status === "done") {
        return null;
    }

    return (
        <Button onClick={handleDone} className="w-full gap-2" variant="default" size="lg" disabled={isLoading}>
            <CheckCircle className="h-4 w-4" />
            {isLoading ? "Processing..." : "Mark as Done"}
        </Button>
    );
};

export default UpdateStatus;