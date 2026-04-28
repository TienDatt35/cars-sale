import { PrismaClient } from "@prisma/client";
import { cars, storeInfo } from "../lib/car-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed settings from storeInfo
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      address: storeInfo.address,
      hotline: storeInfo.hotline,
      email: storeInfo.email,
      facebook: storeInfo.facebook,
      zalo: storeInfo.zalo,
      map: "https://maps.google.com/?q=123+Nguyen+Van+Linh",
    },
  });

  // Seed cars
  for (const car of cars) {
    // Group variants by capacity into versions
    const versionMap = new Map<string, typeof car.variants>();
    for (const v of car.variants) {
      if (!versionMap.has(v.capacity)) versionMap.set(v.capacity, []);
      versionMap.get(v.capacity)!.push(v);
    }

    const versions = Array.from(versionMap.entries()).map(([capacity, variants], idx) => ({
      name: capacity,
      order: idx,
      specs: {
        engine: car.specifications.engine,
        power: car.specifications.power,
        torque: car.specifications.torque,
        transmission: car.specifications.transmission,
        fuel: car.specifications.fuelConsumption,
        seats: String(car.specifications.seats),
        dimensions: car.specifications.dimensions,
      },
      colors: variants.map((v, cidx) => ({
        name: v.color,
        colorCode: v.colorCode,
        colorImages: v.colorImages ?? [],
        price: v.price,
        order: cidx,
      })),
    }));

    await prisma.car.upsert({
      where: { id: car.id },
      update: {},
      create: {
        id: car.id,
        name: car.name,
        brand: car.brand,
        category: car.category,
        basePrice: car.basePrice,
        thumbnail: car.thumbnail,
        images: car.images,
        features: car.features,
        specifications: car.specifications,
        description: car.description,
        descriptionImages: car.descriptionImages ?? [],
        promotions: car.promotions,
        isFeatured: car.isFeatured,
        locked: false,
        tags: [car.category, car.brand],
        versions: {
          create: versions.map((ver) => ({
            name: ver.name,
            specs: ver.specs,
            order: ver.order,
            colors: {
              create: ver.colors,
            },
          })),
        },
      },
    });

    console.log(`  ✓ ${car.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
