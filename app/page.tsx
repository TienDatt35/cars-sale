"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { CarCard } from "@/components/car-card";
import { ContactButtons } from "@/components/contact-buttons";
import { useStore, adminCarToWebCar } from "@/lib/store";
import { storeInfo } from "@/lib/car-data";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Shield, CreditCard, RefreshCw } from "lucide-react";

export default function HomePage() {
  const { adminCars, settings } = useStore();
  const fordCars = adminCars
    .filter((car) => !car.locked && car.brand === "Ford")
    .map(adminCarToWebCar);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Ford Cars Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">
                Dòng xe Ford
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Khám phá các dòng xe Ford chính hãng với mức giá ưu đãi và nhiều chương trình khuyến mãi hấp dẫn
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fordCars.map((car) => (
                <CarCard key={car.id} car={car} showFeaturedBadge={false} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Tại sao chọn chúng tôi?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cam kết mang đến trải nghiệm mua xe Ford tốt nhất cho khách hàng
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Xe chính hãng 100%</h3>
                  <p className="text-sm text-muted-foreground">
                    Cam kết xe Ford nhập khẩu chính hãng với đầy đủ giấy tờ pháp lý
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Ưu đãi hấp dẫn</h3>
                  <p className="text-sm text-muted-foreground">
                    Nhiều chương trình khuyến mãi, quà tặng giá trị trong năm
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Hỗ trợ trả góp, vay vốn</h3>
                  <p className="text-sm text-muted-foreground">
                    Thủ tục nhanh gọn, lãi suất ưu đãi từ 0%, duyệt hồ sơ trong 24h
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Thu cũ đổi mới</h3>
                  <p className="text-sm text-muted-foreground">
                    Định giá xe cũ miễn phí, hỗ trợ thủ tục sang tên nhanh chóng
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Promotions Banner */}
        <section id="promotions" className="py-12 md:py-16 bg-[#003478] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ưu đãi đặc biệt tháng này
            </h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Hỗ trợ 100% lệ phí trước bạ, tặng phụ kiện chính hãng trị giá đến 50 triệu đồng và nhiều ưu đãi hấp dẫn khác
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-white/20 rounded-full text-base">Giảm đến 100 triệu</div>
              <div className="px-4 py-2 bg-white/20 rounded-full text-base">Trả góp 0%</div>
              <div className="px-4 py-2 bg-white/20 rounded-full text-base">Bảo hành 5 năm</div>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section id="contact" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-muted-foreground">
                Ghé thăm showroom Ford hoặc liên hệ hotline để được tư vấn
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">{storeInfo.name}</h3>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          <span className="font-medium text-foreground">Địa chỉ:</span>{" "}
                          {settings.address || storeInfo.address}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Hotline:</span>{" "}
                          <a href={`tel:${(settings.hotline || storeInfo.hotline).replace(/\s/g, "")}`} className="text-primary hover:underline">
                            {settings.hotline || storeInfo.hotline}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Email:</span>{" "}
                          <a href={`mailto:${settings.email || storeInfo.email}`} className="text-primary hover:underline">
                            {settings.email || storeInfo.email}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Giờ làm việc:</span>{" "}
                          {storeInfo.workingHours}
                        </p>
                      </div>
                    </div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0628!2d106.7!3d10.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzAwLjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2svn!4v1600000000000!5m2!1svi!2svn"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Showroom location"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactButtons />
    </div>
  );
}
