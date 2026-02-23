import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

export const PATCH = async (request: Request, context: {params: {id: string}}) => {
    const { id } = await context.params;
    const data = await request.formData();

    const name = data.get("name") as string;
    const price = Number(data.get("price"));
    const category_id = Number(data.get("category_id"));
    const file = data.get("image") as File;

    let updateData: any = {
        name,
        price,
        category_id
    };

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = Date.now() + "-" + file.name;
        const uploadPath = path.join(process.cwd(), "public/uploads", fileName);
        await writeFile(uploadPath, buffer);

        updateData.image = fileName;
    }

    const product = await prisma.product.update({
        where:{
            id: Number(id)
        },
        data: updateData
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