import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (request: Request) => {
    const body = await request.json();
    const ids = body.ids.map((id: any) => Number(id));

    const product = await prisma.product.findMany({
        where: {    
            id: {
                in: ids
            }
        }
    });

    return NextResponse.json(product, {status: 201});
}