"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteModal } from "@/components/quote-modal";

interface QuoteButtonProps {
  carId: string;
  className?: string;
}

export function QuoteButton({ carId, className = "" }: QuoteButtonProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setQuoteModalOpen(true)}
        className={`h-12 bg-primary hover:bg-primary/90 gap-2 ${className}`}
      >
        <Car className="h-5 w-5" />
        Báo giá lăn bánh
      </Button>
      <QuoteModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        selectedCarId={carId}
      />
    </>
  );
}
