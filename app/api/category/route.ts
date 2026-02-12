import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const POST = async (request: Request) => {
    const body: Category = await request.json();
    const category = await prisma.category.create({
        data:{
            name: body.name,
        }
    });

    return NextResponse.json(category, {status: 201});
}