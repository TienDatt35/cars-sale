"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook } from "lucide-react";
import { storeInfo } from "@/lib/car-data";
import { useStore } from "@/lib/store";

export function Footer() {
  const { settings, adminCars } = useStore();
  const fordCars = adminCars.filter((car) => !car.locked && car.brand === "Ford");

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/icon.svg" alt="Ford" className="h-10 w-20 object-contain brightness-0 invert" />
              <h3 className="font-bold">{storeInfo.name}</h3>
            </div>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{settings.address || storeInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>Hotline: {settings.hotline || storeInfo.hotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{settings.email || storeInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{storeInfo.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold mb-4">Sản phẩm Ford</h3>
            <ul className="space-y-2 text-sm text-muted">
              {fordCars.map((car) => (
                <li key={car.id}>
                  <Link href={`/xe/${car.id}`} className="hover:text-background transition-colors">
                    {car.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Support */}
          <div>
            <h3 className="font-bold mb-4">Kết nối với chúng tôi</h3>
            <div className="flex gap-3 mb-6">
              <a
                href={settings.facebook || storeInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={settings.zalo || storeInfo.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                aria-label="Zalo"
              >
                <span className="text-sm font-bold">Z</span>
              </a>
            </div>
            
            <h3 className="font-bold mb-3">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/#" className="hover:text-background transition-colors">
                  Hướng dẫn mua xe
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-background transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-background transition-colors">
                  Hỗ trợ trả góp
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-background transition-colors">
                  Lịch bảo dưỡng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} {storeInfo.name}. Tất cả quyền được bảo lưu.</p>
          <p className="mt-1">
            Giấy phép kinh doanh số: 0123456789 - Cấp ngày: 01/01/2020
          </p>
        </div>
      </div>
    </footer>
  );
}
