import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      address: body.address ?? "",
      hotline: body.hotline ?? "",
      email: body.email ?? "",
      facebook: body.facebook ?? "",
      zalo: body.zalo ?? "",
      map: body.map ?? "",
    },
    create: {
      id: 1,
      address: body.address ?? "",
      hotline: body.hotline ?? "",
      email: body.email ?? "",
      facebook: body.facebook ?? "",
      zalo: body.zalo ?? "",
      map: body.map ?? "",
    },
  });

  return NextResponse.json(settings);
}
