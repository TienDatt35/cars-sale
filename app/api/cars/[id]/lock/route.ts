import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { locked } = await request.json();

  const car = await prisma.car.update({
    where: { id },
    data: { locked },
  });

  return NextResponse.json(car);
}
