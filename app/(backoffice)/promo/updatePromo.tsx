'use client';
import { useState, SyntheticEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

type Promo = {
    id: number;
    name: string;
    discount: number;
}

const UpdatePromo = ({ promo }: { promo: Promo }) => {
    const [name, setName] = useState(promo.name);
    const [discount, setDiscount] = useState(promo.discount.toString());
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await axios.patch(`/api/promo/${promo.id}`, {
                name,
                discount: Number(discount)
            });
            router.refresh();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Promo</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Promo Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter promo name" required/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="discount">Discount (%)</Label>
                                <Input id="discount" type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Enter discount percentage" required/>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdatePromo;