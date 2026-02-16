import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Promo } from "@prisma/client";
import { request } from "http";

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

export const GET = async () => {
    const promos = await prisma.promo.findMany();

    return NextResponse.json(promos, {status: 200});
}