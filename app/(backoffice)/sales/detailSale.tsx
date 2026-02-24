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
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";

type Sales = {
    id: number;
    total_price: number;
    discount: number;
    final_price: number;
}

type DetailItem = {
    id: number;
    qty: number;
    price: number;
    product: {
        name: string;
    }
}

const DetailSale = ({ sale }: { sale: Sales }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState<DetailItem[]>([]);

    const handleModal = async () => {
        if (!isOpen) {
            const res = await axios.get(`/api/sales/${sale.id}`);
            setDetails(res.data.detail_sales);
        }
        setIsOpen(!isOpen);
    };

    const subtotal = details.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <>
            <Button variant="outline" size="sm" onClick={handleModal} className="gap-2">
                <Eye className="h-4 w-4" />
                Detail
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sale Details #{sale.id}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {details.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Rp {item.price.toLocaleString()} x {item.qty}
                                    </p>
                                </div>
                                <span className="font-medium">
                                    Rp {(item.price * item.qty).toLocaleString()}
                                </span>
                            </div>
                        ))}

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>Rp {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="text-red-600">- {sale.discount}%</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>Rp {sale.final_price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleModal}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DetailSale;