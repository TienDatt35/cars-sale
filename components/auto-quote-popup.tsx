"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { QuoteModal } from "@/components/quote-modal";

const DELAY_MS = 2000;

export function AutoQuotePopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    const timer = setTimeout(() => {
      setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <QuoteModal open={open} onOpenChange={setOpen} />;
}
