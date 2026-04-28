import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const include = {
  versions: {
    orderBy: { order: "asc" as const },
    include: {
      colors: { orderBy: { order: "asc" as const } },
    },
  },
};

function computeBasePrice(versions: { colors: { price: number }[] }[]): number {
  const prices = versions.flatMap((v) => v.colors.map((c) => c.price)).filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id }, include });
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const { versions, id: _bodyId, locked, tags, isFeatured, name, brand, category, thumbnail, images, features, specifications, description, descriptionImages, promotions } = body;
  const carData = { locked, tags, isFeatured, name, brand, category, thumbnail, images: images ?? [], features: features ?? [], specifications: specifications ?? {}, description: description ?? "", descriptionImages: descriptionImages ?? [], promotions: promotions ?? [] };
  const basePrice = computeBasePrice(versions ?? []);

  const versionsCreate = (versions ?? []).map((ver: {
    name: string;
    specs: Record<string, string>;
    order?: number;
    colors: { name: string; colorCode?: string; colorImages?: string[]; price: number; order?: number }[];
  }) => ({
    name: ver.name,
    specs: ver.specs,
    order: ver.order ?? 0,
    colors: {
      create: ver.colors.map((c) => ({
        name: c.name,
        colorCode: c.colorCode ?? "#888888",
        colorImages: c.colorImages ?? [],
        price: Number(c.price),
        order: c.order ?? 0,
      })),
    },
  }));

  try {
    // Delete existing versions so we can recreate them
    await prisma.carVersion.deleteMany({ where: { carId: id } });

    // Upsert: update if exists, create (with the original id) if not
    const car = await prisma.car.upsert({
      where: { id },
      update: {
        ...carData,
        basePrice,
        versions: { create: versionsCreate },
      },
      create: {
        id,
        ...carData,
        basePrice,
        versions: { create: versionsCreate },
      },
      include,
    });

    return NextResponse.json(car);
  } catch (err) {
    console.error("PUT /api/cars/[id] error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.car.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
