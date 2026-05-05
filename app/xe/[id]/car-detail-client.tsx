"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Car, MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteModal } from "@/components/quote-modal";
import { type Car as CarType, formatPrice, storeInfo } from "@/lib/car-data";
import { useStore, adminCarToWebCar } from "@/lib/store";

interface CarDetailClientProps {
  carId: string;
  initialCar: CarType;
}

export function CarDetailClient({ carId, initialCar }: CarDetailClientProps) {
  const { adminCars, settings } = useStore();
  const adminCar = adminCars.find((c) => c.id === carId);
  const car = adminCar ? adminCarToWebCar(adminCar) : initialCar;
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [selectedColorImages, setSelectedColorImages] = useState<string[] | null>(null);
  const [colorLightboxOpen, setColorLightboxOpen] = useState(false);
  const [currentColorImageIndex, setCurrentColorImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const priceSection = document.getElementById("price-table");
      if (priceSection) {
        const rect = priceSection.getBoundingClientRect();
        // Show buttons when price table is in view or past it
        setIsContactVisible(rect.top <= window.innerHeight * 0.8);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (!colorLightboxOpen || !selectedColorImages) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentColorImageIndex(prev => 
          prev === 0 ? selectedColorImages.length - 1 : prev - 1
        );
      }
      if (e.key === "ArrowRight") {
        setCurrentColorImageIndex(prev => 
          prev === selectedColorImages.length - 1 ? 0 : prev + 1
        );
      }
      if (e.key === "Escape") {
        setColorLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [colorLightboxOpen, selectedColorImages]);

  const handleColorClick = (colorImages: string[] | undefined) => {
    if (colorImages && colorImages.length > 0) {
      setSelectedColorImages(colorImages);
      setCurrentColorImageIndex(0);
      setColorLightboxOpen(true);
    }
  };

  return (
    <>
      {/* Price Table */}
      <section id="price-table" className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Bảng giá {car.name}
        </h2>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold min-w-[150px]">Màu sắc</th>
                  <th className="text-left p-4 font-semibold">Phiên bản</th>
                  <th className="text-right p-4 font-semibold">Giá niêm yết</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {car.variants.map((variant, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <button
                        className="flex items-center gap-2 group cursor-pointer text-left"
                        onClick={() => handleColorClick(variant.colorImages)}
                        disabled={!variant.colorImages || variant.colorImages.length === 0}
                      >
                        <div
                          className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary transition-colors flex-shrink-0"
                          style={{ backgroundColor: variant.colorCode }}
                        />
                        <span className={`${variant.colorImages && variant.colorImages.length > 0 ? "group-hover:text-primary transition-colors underline-offset-2 group-hover:underline" : ""}`}>
                          {variant.color}
                        </span>
                        {variant.colorImages && variant.colorImages.length > 0 && (
                          <span className="text-xs text-muted-foreground">(Xem ảnh)</span>
                        )}
                      </button>
                    </td>
                    <td className="p-4">{variant.capacity}</td>
                    <td className="p-4 text-right font-medium text-primary">
                      {formatPrice(variant.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Color Images Lightbox */}
      {colorLightboxOpen && selectedColorImages && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setColorLightboxOpen(false)}
        >
          <Image
            src={selectedColorImages[currentColorImageIndex]}
            alt="Car color view"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 text-white z-10"
            onClick={() => setColorLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation */}
          {selectedColorImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/20 hover:bg-white/40 text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentColorImageIndex(prev => 
                    prev === 0 ? selectedColorImages.length - 1 : prev - 1
                  );
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/20 hover:bg-white/40 text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentColorImageIndex(prev => 
                    prev === selectedColorImages.length - 1 ? 0 : prev + 1
                  );
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-medium z-10">
            {currentColorImageIndex + 1} / {selectedColorImages.length}
          </div>
        </div>
      )}

      {/* Floating Contact Buttons - Only visible after scrolling to price table */}
      {isContactVisible && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 animate-in slide-in-from-right-5 duration-300">
          {/* Quote Button */}
          <Button
            onClick={() => setQuoteModalOpen(true)}
            className="h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 px-5 gap-2"
          >
            <Car className="h-5 w-5" />
            <span className="hidden sm:inline">Báo giá/Lái thử</span>
          </Button>

          {/* Zalo Button */}
          <a
            href={settings.zalo || storeInfo.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              className="h-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 px-5 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Liên hệ Zalo</span>
            </Button>
          </a>

          {/* Hotline Button with Animation */}
          <a href={`tel:${(settings.hotline || storeInfo.hotline).replace(/\s/g, "")}`} className="inline-flex">
            <Button
              className="h-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 px-5 gap-2 relative overflow-hidden"
            >
              {/* Ripple animation */}
              <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
              <Phone className="h-5 w-5 relative z-10 animate-bounce" />
              <span className="hidden sm:inline relative z-10">{settings.hotline || storeInfo.hotline}</span>
            </Button>
          </a>
        </div>
      )}

      <QuoteModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        selectedCarId={car.id}
      />
    </>
  );
}
