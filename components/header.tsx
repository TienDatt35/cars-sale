"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { adminCars } = useStore();
  const fordCars = adminCars.filter((car) => !car.locked && car.brand === "Ford");

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20">
          <div className="flex h-full items-stretch justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 self-center">
              <img src="/icon.svg" alt="Ford" className="h-10 w-20 object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">FORD AUTO STAR</h1>
                <p className="text-xs text-muted-foreground">Đại lý Ford chính hãng</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex self-stretch flex-1 mx-6">
              <Link href="/" className="flex-1 text-sm font-semibold flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200">
                Trang chủ
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex-1 text-sm font-semibold flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200 gap-1 cursor-pointer">
                  Sản phẩm
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {fordCars.map((car) => (
                    <DropdownMenuItem key={car.id} asChild>
                      <Link href={`/xe/${car.id}`} className="w-full cursor-pointer">
                        {car.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/#promotions" className="flex-1 text-sm font-semibold flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200">
                Khuyến mãi
              </Link>

              <Link href="/#contact" className="flex-1 text-sm font-semibold flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-200">
                Liên hệ
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 self-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-muted"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Tìm kiếm</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Sản phẩm Ford</p>
                <div className="flex flex-wrap gap-2">
                  {fordCars.map((car) => (
                    <Link
                      key={car.id}
                      href={`/xe/${car.id}`}
                      className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {car.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link 
                href="/#promotions" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Khuyến mãi
              </Link>
              <Link 
                href="/#contact" 
                className="text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tìm kiếm xe Ford</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              placeholder="Nhập tên xe Ford..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setSearchOpen(false)}>
              <Search className="h-4 w-4 mr-2" />
              Tìm
            </Button>
          </div>
          {searchQuery && (
            <div className="mt-4 space-y-2">
              {fordCars
                .filter((car) =>
                  car.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((car) => (
                  <Link
                    key={car.id}
                    href={`/xe/${car.id}`}
                    className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    <p className="font-medium">{car.name}</p>
                    <p className="text-sm text-muted-foreground">{car.category}</p>
                  </Link>
                ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
