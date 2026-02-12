import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const sales = await prisma.sales.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            detail_sales: {
                include: {
                    product: true
                }
            }
        }
    })

    return NextResponse.json(sales, {status: 200});
}

export const DELETE = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const sales = await prisma.sales.delete({
        where:{
            id: Number(id)
        }
    });

    return NextResponse.json(sales, {status: 200});
}