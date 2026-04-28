"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Link as LinkIcon, Facebook, MessageCircle, Check } from "lucide-react";
import { useStore, type StoreSettings } from "@/lib/store";

export default function SettingsView() {
  const { settings, setSettings } = useStore();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">
        Thông tin liên hệ chung
      </h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 mr-1 text-gray-500" /> Hotline
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.hotline}
              onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 mr-1 text-gray-500" /> Email
            </label>
            <input
              type="email"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-1 text-gray-500" /> Địa chỉ cửa hàng
          </label>
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <LinkIcon className="w-4 h-4 mr-1 text-gray-500" /> Liên kết Google Maps
          </label>
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-blue-600"
            value={formData.map}
            onChange={(e) => setFormData({ ...formData, map: e.target.value })}
          />
        </div>

        <h3 className="text-md font-semibold text-gray-800 pt-4 border-t mt-6">Mạng xã hội</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Facebook className="w-4 h-4 mr-1 text-blue-600" /> Facebook
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MessageCircle className="w-4 h-4 mr-1 text-blue-500" /> Zalo OA
            </label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.zalo}
              onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 flex items-center">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
          >
            Lưu cấu hình
          </button>
          {saved && (
            <span className="ml-4 text-green-600 flex items-center text-sm font-medium">
              <Check className="w-4 h-4 mr-1" /> Đã lưu thành công!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
