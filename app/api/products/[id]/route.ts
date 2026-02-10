import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export const PATCH = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const body: Product = await request.json();
    const product = await prisma.product.update({
        where:{
            id: Number(id)
        },
        data:{
            name: body.name,
            price: body.price,
            category_id: body.category_id
        }
    });

    return NextResponse.json(product, {status: 200});
}

export const DELETE = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const product = await prisma.product.delete({
        where:{
            id: Number(id)
        }
    });

    return NextResponse.json(product, {status: 200});
}