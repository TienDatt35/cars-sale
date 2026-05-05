"use client";

import { useState, useEffect } from "react";
import { Phone, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteModal } from "./quote-modal";
import { storeInfo } from "@/lib/car-data";
import { useStore } from "@/lib/store";

interface ContactButtonsProps {
  selectedCarId?: string;
  showOnScroll?: boolean;
}

export function ContactButtons({ selectedCarId, showOnScroll = false }: ContactButtonsProps) {
  const { settings } = useStore();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const priceSection = document.getElementById("price-table");
      if (!priceSection) return;
      const next = priceSection.getBoundingClientRect().top <= window.innerHeight * 0.8;
      setIsVisible((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll]);

  if (!isVisible) return null;

  return (
    <>
      {/* Fixed Floating Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 animate-in slide-in-from-right-5 duration-300">
        {/* Quote Button */}
        <Button
          onClick={() => setQuoteModalOpen(true)}
          className="h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 px-5 gap-2"
        >
          <Car className="h-5 w-5" />
          <span className="hidden sm:inline">Báo giá/Lái thử</span>
        </Button>

        <Button asChild className="h-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 px-5 gap-2">
          <a href={settings.zalo || storeInfo.zalo} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Liên hệ Zalo</span>
          </a>
        </Button>

        <Button asChild className="h-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 px-5 gap-2 relative overflow-hidden">
          <a href={`tel:${(settings.hotline || storeInfo.hotline).replace(/\s/g, "")}`}>
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
            <Phone className="h-5 w-5 relative z-10 animate-bounce" />
            <span className="hidden sm:inline relative z-10">{settings.hotline || storeInfo.hotline}</span>
          </a>
        </Button>
      </div>

      <QuoteModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        selectedCarId={selectedCarId}
      />
    </>
  );
}
