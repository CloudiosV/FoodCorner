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
import { Plus } from "lucide-react";

const AddPromo = () => {
    const [name, setName] = useState("");
    const [discount, setDiscount] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await axios.post('/api/promo', {
                name,
                discount: Number(discount)
            });
            setName("");
            setDiscount("");
            router.refresh();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to add promo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Promo
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Promo</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
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
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddPromo;