import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Promo } from "@prisma/client";

export const PATCH = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const body: Promo = await request.json();
    const promo = await prisma.promo.update({
        where:{
            id: Number(id)
        },
        data:{
            name: body.name,
            discount: body.discount,
        }
    });

    return NextResponse.json(promo, {status: 200});
}

export const DELETE = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const promo = await prisma.promo.delete({
        where:{
            id: Number(id)
        }
    });

    return NextResponse.json(promo, {status: 200});
}