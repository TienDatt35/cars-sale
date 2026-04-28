import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const colorSchema = z.object({
  name: z.string(),
  colorCode: z.string().default("#888888"),
  colorImages: z.array(z.string()).default([]),
  price: z.number(),
  order: z.number().default(0),
});

const versionSchema = z.object({
  name: z.string(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specs: z.record(z.any()),
  order: z.number().default(0),
  colors: z.array(colorSchema),
});

const carSchema = z.object({
  name: z.string().min(1),
  brand: z.string().default("Ford"),
  category: z.string(),
  thumbnail: z.string().default(""),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specifications: z.record(z.any()),
  description: z.string().default(""),
  descriptionImages: z.array(z.string()).default([]),
  promotions: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  locked: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  versions: z.array(versionSchema).default([]),
});

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

export async function GET() {
  const cars = await prisma.car.findMany({
    include,
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = carSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = result.data;

  const { versions, ...carData } = data;
  const basePrice = computeBasePrice(versions);

  try {
    const car = await prisma.car.create({
      data: {
        ...carData,
        basePrice,
        versions: {
          create: versions.map((ver) => ({
            name: ver.name,
            specs: ver.specs,
            order: ver.order,
            colors: {
              create: ver.colors.map((c) => ({
                name: c.name,
                colorCode: c.colorCode,
                colorImages: c.colorImages,
                price: c.price,
                order: c.order,
              })),
            },
          })),
        },
      },
      include,
    });
    return NextResponse.json(car, { status: 201 });
  } catch (err) {
    console.error("POST /api/cars error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
