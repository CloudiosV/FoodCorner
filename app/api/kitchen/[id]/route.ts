import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const PATCH = async (request: Request, context: {params: {id: string}}) => {
  try {
    const { id } = await context.params;
    const { status } = await request.json();

    const updatedOrder = await prisma.sales.update({
      where: {
        id: Number(id)
      },
      data: { status }
    });

    return NextResponse.json(updatedOrder, {status: 200});
  } catch (error) {
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}