import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export const POST = async (request: Request) => {
    const body: Product = await request.json();
    const product = await prisma.product.create({
        data:{
            name: body.name,
            price: body.price,
            category_id: body.category_id
        }
    });

    return NextResponse.json(product, {status: 201});
}