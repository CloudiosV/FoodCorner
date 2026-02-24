'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Sales = {
    id: number;
    total_price: number;
    discount: number;
    final_price: number;
}

const DeleteSale = ({ sale }: { sale: Sales }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (sale_id: number) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/sales/${sale_id}`);
            router.refresh();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Button variant="destructive" size="sm" onClick={handleModal} className="gap-2">
                <Trash2 className="h-4 w-4"/>
                Delete
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Sale</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-center text-muted-foreground">
                            Are you sure you want to delete sale #{sale.id}?
                        </p>
                        <p className="text-center text-sm text-muted-foreground mt-2">
                            This action cannot be undone.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={handleModal} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(sale.id)} disabled={isLoading}>
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteSale;