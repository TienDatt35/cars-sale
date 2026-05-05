import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImageGallery } from "@/components/image-gallery";
import { CarDetailClient } from "./car-detail-client";
import { QuoteButton } from "@/components/quote-button";
import { getCarById, cars, formatPrice, storeInfo, type Car, type CarVariant } from "@/lib/car-data";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Gift,
  Fuel,
  Users,
  Cog,
  Zap,
  Check,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCarFromDb(id: string): Promise<Car | null> {
  try {
    const dbCar = await prisma.car.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { order: "asc" },
          include: { colors: { orderBy: { order: "asc" } } },
        },
      },
    });
    if (!dbCar) return null;

    const variants: CarVariant[] = dbCar.versions.flatMap((ver: { name: string; colors: { name: string; colorCode: string | null; colorImages: string[]; price: number }[] }) =>
      ver.colors.map((c) => ({
        color: c.name,
        colorCode: c.colorCode || "#888888",
        colorImages: c.colorImages,
        capacity: ver.name,
        price: c.price,
      }))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const specs = dbCar.specifications as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verSpecs = (dbCar.versions[0]?.specs as any) ?? {};
    return {
      id: dbCar.id,
      name: dbCar.name,
      brand: dbCar.brand,
      category: dbCar.category,
      basePrice: dbCar.basePrice,
      images: dbCar.images,
      thumbnail: dbCar.thumbnail,
      variants,
      features: dbCar.features,
      specifications: {
        engine: specs?.engine || verSpecs?.engine || "",
        power: specs?.power || verSpecs?.power || "",
        torque: specs?.torque || verSpecs?.torque || "",
        transmission: specs?.transmission || verSpecs?.transmission || "",
        fuelConsumption: specs?.fuelConsumption || verSpecs?.fuel || "",
        seats: Number(specs?.seats || verSpecs?.seats || 5),
        dimensions: specs?.dimensions || verSpecs?.dimensions || "",
      },
      description: dbCar.description,
      descriptionImages: dbCar.descriptionImages,
      promotions: dbCar.promotions,
      isFeatured: dbCar.isFeatured,
    };
  } catch {
    return null;
  }
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<u>[^<]+<\/u>|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^<u>[^<]+<\/u>$/.test(part)) return <u key={i}>{part.slice(3, -4)}</u>;
    const img = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) return <img key={i} src={img[2]} alt={img[1]} className="inline max-h-48 rounded" />;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{link[1]}</a>;
    return part;
  });
}

type Segment =
  | { type: "text"; content: string }
  | { type: "cols2"; left: string; right: string };

function parseSegments(description: string): Segment[] {
  const chunks = description.split(/(\[2cols\][\s\S]*?\[\/2cols\])/g);
  const segments: Segment[] = [];
  for (const chunk of chunks) {
    if (chunk.startsWith("[2cols]")) {
      const inner = chunk.slice(7, -8).trim();
      const [left = "", right = ""] = inner.split("|||").map((s) => s.trim());
      segments.push({ type: "cols2", left, right });
    } else {
      for (const p of chunk.split("\n\n").map((p) => p.trim()).filter(Boolean)) {
        segments.push({ type: "text", content: p });
      }
    }
  }
  return segments;
}

function renderColContent(text: string): React.ReactNode {
  return text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => {
      const m = p.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (m) return <img key={i} src={m[2]} alt={m[1]} className="w-full h-auto rounded-lg object-cover" />;
      if (p.startsWith("## "))
        return <h4 key={i} className="font-bold text-lg text-foreground mb-1">{renderInline(p.slice(3))}</h4>;
      return <p key={i} className="text-foreground text-sm leading-relaxed">{renderInline(p)}</p>;
    });
}

export async function generateStaticParams() {
  return cars.map((car) => ({
    id: car.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const car = getCarById(id) ?? await getCarFromDb(id);

  if (!car) {
    return {
      title: "Xe không tồn tại",
    };
  }

  return {
    title: `${car.name} - ${formatPrice(car.basePrice)} | FORD AUTO STAR`,
    description: `Mua xe ${car.name} chính hãng tại FORD AUTO STAR. ${car.features.slice(0, 3).join(", ")}. Giá từ ${formatPrice(car.basePrice)}.`,
  };
}

async function getSettings() {
  try {
    return await prisma.settings.findUnique({ where: { id: 1 } });
  } catch {
    return null;
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [car, dbSettings] = await Promise.all([
    getCarById(id) ? Promise.resolve(getCarById(id)) : getCarFromDb(id),
    getSettings(),
  ]);
  const zalo = dbSettings?.zalo || storeInfo.zalo;
  const hotline = dbSettings?.hotline || storeInfo.hotline;

  if (!car) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary">
                Trang chủ
              </a>
              <span>/</span>
              <span className="text-foreground">{car.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-3">
              <ImageGallery images={car.images} alt={car.name} />
            </div>

            {/* Right Column - Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Title & Price */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-[#003478] text-white hover:bg-[#003478]/90">Ford</Badge>
                  <Badge variant="outline">{car.category}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{car.name}</h1>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(car.basePrice)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  * Giá niêm yết, chưa bao gồm khuyến mãi
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Fuel className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Động cơ</p>
                    <p className="font-medium text-sm">{car.specifications.engine}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Công suất</p>
                    <p className="font-medium text-sm">{car.specifications.power}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Cog className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hộp số</p>
                    <p className="font-medium text-sm">{car.specifications.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Số chỗ</p>
                    <p className="font-medium text-sm">{car.specifications.seats} chỗ</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <QuoteButton carId={car.id} className="w-full" />
                </div>
                <a
                  href={zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Liên hệ tư vấn Zalo
                  </Button>
                </a>
                <a href={`tel:${hotline.replace(/\s/g, "")}`} className="flex-1">
                  <Button className="w-full h-12 bg-green-500 hover:bg-green-600 gap-2 relative overflow-hidden">
                    <span className="absolute inset-0 rounded-md bg-white/10 animate-pulse" />
                    <Phone className="h-5 w-5 relative z-10 animate-bounce" />
                    <span className="relative z-10">Gọi ngay</span>
                  </Button>
                </a>
              </div>

              {/* Features */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Tính năng nổi bật</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Price Table with Color Images */}
          <CarDetailClient carId={car.id} initialCar={car} />

          {/* Promotions */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <Gift className="h-6 w-6 text-primary" />
              Chương trình khuyến mãi
            </h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {car.promotions.map((promo, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-sm pt-1">{promo}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Support Info */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Hỗ trợ khách hàng
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Tư vấn 24/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Hotline: 0909 123 456
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Bảo hành chính hãng</h3>
                  <p className="text-sm text-muted-foreground">
                    Bảo hành 3-5 năm toàn quốc
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Hỗ trợ trả góp</h3>
                  <p className="text-sm text-muted-foreground">
                    Lãi suất ưu đãi từ 0%/năm
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Specifications */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Thông số kỹ thuật
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="flex p-4">
                    <span className="font-medium w-1/3">Động cơ</span>
                    <span className="w-2/3">{car.specifications.engine}</span>
                  </div>
                  <div className="flex p-4 bg-muted/50">
                    <span className="font-medium w-1/3">Công suất</span>
                    <span className="w-2/3">{car.specifications.power}</span>
                  </div>
                  <div className="flex p-4">
                    <span className="font-medium w-1/3">Mô-men xoắn</span>
                    <span className="w-2/3">{car.specifications.torque}</span>
                  </div>
                  <div className="flex p-4 bg-muted/50">
                    <span className="font-medium w-1/3">Hộp số</span>
                    <span className="w-2/3">{car.specifications.transmission}</span>
                  </div>
                  <div className="flex p-4">
                    <span className="font-medium w-1/3">Tiêu thụ nhiên liệu</span>
                    <span className="w-2/3">{car.specifications.fuelConsumption}</span>
                  </div>
                  <div className="flex p-4 bg-muted/50">
                    <span className="font-medium w-1/3">Số chỗ ngồi</span>
                    <span className="w-2/3">{car.specifications.seats} chỗ</span>
                  </div>
                  <div className="flex p-4">
                    <span className="font-medium w-1/3">Kích thước (DxRxC)</span>
                    <span className="w-2/3">{car.specifications.dimensions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Description - Article Style with Images */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Đánh giá chi tiết {car.name}
            </h2>
            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                {parseSegments(car.description).map((seg, index) => {
                  if (seg.type === "cols2") {
                    return (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 md:px-12 my-8">
                        <div className="space-y-3">{renderColContent(seg.left)}</div>
                        <div className="space-y-3">{renderColContent(seg.right)}</div>
                      </div>
                    );
                  }

                  const paragraph = seg.content;
                  const imgMatch = paragraph.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                  if (imgMatch) {
                    return <img key={index} src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto block" />;
                  }

                  if (paragraph.startsWith("## ")) {
                    const descImage = car.descriptionImages?.[Math.min(index, (car.descriptionImages?.length || 1) - 1)];
                    return (
                      <div key={index}>
                        {descImage && index > 0 && (
                          <img src={descImage} alt={paragraph.replace("## ", "")} className="w-full h-auto block" />
                        )}
                        <div className="px-6 md:px-12">
                          <h3 className="text-2xl md:text-3xl font-extrabold mt-8 mb-4 text-foreground tracking-tight">
                            {renderInline(paragraph.replace("## ", ""))}
                          </h3>
                        </div>
                      </div>
                    );
                  }

                  if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n");
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 my-4 px-6 md:px-12 text-foreground">
                        {items.map((item, i) => (
                          <li key={i}>{renderInline(item.replace(/^- /, ""))}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={index} className={`text-foreground leading-relaxed px-6 md:px-12 mb-4 ${index === 0 ? "pt-8" : ""}`}>
                      {renderInline(paragraph)}
                    </p>
                  );
                })}
                <div className="pb-8" />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
