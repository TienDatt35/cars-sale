"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCarId?: string;
}

export function QuoteModal({ open, onOpenChange, selectedCarId }: QuoteModalProps) {
  const { adminCars } = useStore();
  const [requestType, setRequestType] = useState("Báo giá");
  const [paymentType, setPaymentType] = useState("installment");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCar, setSelectedCar] = useState(selectedCarId || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setName("");
    setPhone("");
    setPaymentType("installment");
    setRequestType("Báo giá");
    if (!selectedCarId) setSelectedCar("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const carName = adminCars.find((c) => c.id === selectedCar)?.name ?? selectedCar;
    const payment =
      paymentType === "installment" ? "Trả góp" : paymentType === "full" ? "Trả thẳng" : "Chưa rõ";

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: requestType, name, phone, car: carName, payment }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.");
        setTimeout(() => {
          setSubmitted(false);
          onOpenChange(false);
          resetForm();
        }, 2000);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch {
      toast.error("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden [&>button]:hidden">
        {/* Custom Close Button - Circle with X like the reference image */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute -top-3 -right-3 z-50 w-8 h-8 rounded-full bg-gray-800 border-2 border-white text-white flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Car Image */}
          <div className="hidden md:block md:w-2/5 relative bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <Image
                src="https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&h=800&fit=crop"
                alt="Ford Car"
                width={300}
                height={400}
                className="object-contain drop-shadow-xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-primary">FORD VIỆT NAM</h3>
                <p className="text-sm text-muted-foreground">Go Further</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-primary">
                Báo giá lăn bánh và lái thử
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Vui lòng điền thông tin để nhận báo giá chi tiết và đặt lịch lái thử
              </DialogDescription>
            </DialogHeader>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gửi yêu cầu thành công!</h3>
                <p className="text-muted-foreground">
                  Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-base">Loại yêu cầu</Label>
                  <RadioGroup
                    value={requestType}
                    onValueChange={setRequestType}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Báo giá" id="quote" />
                      <Label htmlFor="quote" className="cursor-pointer text-base">
                        Báo giá lăn bánh
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Lái thử" id="testdrive" />
                      <Label htmlFor="testdrive" className="cursor-pointer text-base">
                        Đặt lịch lái thử
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Hình thức thanh toán</Label>
                  <RadioGroup
                    value={paymentType}
                    onValueChange={setPaymentType}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="installment" id="installment" />
                      <Label htmlFor="installment" className="cursor-pointer text-base">
                        Trả góp
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="cursor-pointer text-base">
                        Trả thẳng
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Họ và tên *</Label>
                  <Input
                    id="name"
                    placeholder="Nhập họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-11 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car" className="text-base">Dòng xe quan tâm *</Label>
                  <Select
                    value={selectedCar}
                    onValueChange={setSelectedCar}
                    required
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Chọn dòng xe" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminCars
                        .filter((c) => !c.locked)
                        .map((car) => (
                          <SelectItem key={car.id} value={car.id}>
                            {car.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold mt-2" disabled={submitting}>
                  {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
