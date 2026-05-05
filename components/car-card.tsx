import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Car, formatPrice } from "@/lib/car-data";

interface CarCardProps {
  car: Car;
  showFeaturedBadge?: boolean;
}

export function CarCard({ car, showFeaturedBadge = true }: CarCardProps) {
  return (
    <Link href={`/xe/${car.id}`} className="h-full">
      <Card className="group h-full flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted shrink-0">
          {car.thumbnail ? (
            <Image
              src={car.thumbnail}
              alt={car.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Chưa có ảnh
            </div>
          )}
          {car.isFeatured && showFeaturedBadge && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              Nổi bật
            </Badge>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90">
              {car.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="mb-2 flex-1">
            <p className="text-sm text-muted-foreground">{car.brand}</p>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {car.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1 mb-3 min-h-[28px]">
            {car.features.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-primary font-bold">
              {formatPrice(car.basePrice)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
