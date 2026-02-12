import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Promo } from "@prisma/client";

export const POST = async (request: Request) => {
    const body: Promo = await request.json();
    const promo = await prisma.promo.create({
        data:{
            name: body.name,
            discount: body.discount,
        }
    });

    return NextResponse.json(promo, {status: 201});
}