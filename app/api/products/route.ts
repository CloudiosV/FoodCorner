import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

export const POST = async (request: Request) => {
    const data = await request.formData();

    const name = data.get("name") as string;
    const price = Number(data.get("price"));
    const category_id = Number(data.get("category_id"));
    const file = data.get("image") as File;

    let fileName = "";

    if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        fileName = Date.now() + "-" + file.name;

        const uploadPath = path.join(process.cwd(), "public/uploads", fileName);
        await writeFile(uploadPath, buffer);
    }

    const product = await prisma.product.create({
        data:{
            name,
            price,
            category_id,
            image: fileName
        }
    });

    return NextResponse.json(product, {status: 201});
}