import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    const body = await request.json();

    const { cart, subtotal, discount, final_price} = body;

    if(!cart || cart.length == 0) {
        return NextResponse.json({message: "Cart Kosong"}, {status: 400});
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const sale = await tx.sales.create({
                data: {
                    total_price: subtotal,
                    discount: discount,
                    final_price: final_price
                }
            });

            for(const item of cart) {
                const product = await tx.product.findUnique({
                    where: {id: item.id}
                });

                if(!product) continue;

                await tx.detailSales.create({
                    data: {
                        sales_id: sale.id,
                        product_id: product.id,
                        qty: item.qty,
                        price: product.price,
                        subtotal: product.price * item.qty
                    }
                })
            }

            return sale;
        });

        return NextResponse.json({message: "Success saving data"}, {status: 201});
        
    } catch (error) {
        return NextResponse.json({message: "Error saving data"}, {status: 500});
    }
}