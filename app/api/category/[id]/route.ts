import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const PATCH = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const body: Category = await request.json();
    const category = await prisma.category.update({
        where:{
            id: Number(id)
        },
        data:{
            name: body.name,
        }
    });

    return NextResponse.json(category, {status: 200});
}

export const DELETE = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const category = await prisma.category.delete({
        where:{
            id: Number(id)
        }
    });

    return NextResponse.json(category, {status: 200});
}