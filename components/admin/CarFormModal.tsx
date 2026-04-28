"use client";

import { useState, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading2,
  AlignLeft,
} from "lucide-react";
import type { AdminCar, AdminVersion } from "@/lib/store";

const defaultSpecs: AdminVersion["specs"] = {
  engine: "",
  power: "",
  torque: "",
  transmission: "",
  fuel: "",
  seats: "",
  dimensions: "",
};

interface CarFormModalProps {
  car: AdminCar | null;
  onClose: () => void;
  onSave: (car: AdminCar) => void;
}

export default function CarFormModal({ car, onClose, onSave }: CarFormModalProps) {
  const [formData, setFormData] = useState<AdminCar>(
    car ?? {
      id: "",
      name: "",
      brand: "Ford",
      category: "",
      basePrice: 0,
      images: [],
      thumbnail: "",
      features: [""],
      specifications: {
        engine: "",
        power: "",
        torque: "",
        transmission: "",
        fuelConsumption: "",
        seats: 5,
        dimensions: "",
      },
      description: "",
      promotions: [""],
      isFeatured: false,
      locked: false,
      tags: [],
      versions: [
        {
          id: Date.now(),
          name: "",
          specs: { ...defaultSpecs },
          colors: [{ id: Date.now() + 1, name: "", price: 0 }],
        },
      ],
    }
  );
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "variants" | "content">("info");
  const [collapsedVersions, setCollapsedVersions] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const applyInline = (before: string, after: string = before) => {
    const ta = descRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || "văn bản";
    const newVal =
      ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
    setFormData((prev) => ({ ...prev, description: newVal }));
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  const applyLinePrefix = (prefix: string) => {
    const ta = descRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
    const alreadyHas = ta.value.substring(lineStart).startsWith(prefix);
    const newVal = alreadyHas
      ? ta.value.substring(0, lineStart) + ta.value.substring(lineStart + prefix.length)
      : ta.value.substring(0, lineStart) + prefix + ta.value.substring(lineStart);
    const delta = alreadyHas ? -prefix.length : prefix.length;
    setFormData((prev) => ({ ...prev, description: newVal }));
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + delta;
      ta.selectionEnd = start + delta;
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("Nhập URL liên kết:");
    if (!url) return;
    applyInline("[", `](${url})`);
  };

  const handleDescImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      const ta = descRef.current;
      const pos = ta ? ta.selectionStart : formData.description.length;
      const insert = `\n![ảnh](${url})\n`;
      setFormData((prev) => ({
        ...prev,
        description:
          prev.description.substring(0, pos) + insert + prev.description.substring(pos),
      }));
    }
    setUploading(false);
    e.target.value = "";
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) return null;
      const { url } = await res.json();
      return url as string;
    } catch {
      return null;
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setFormData((prev) => ({ ...prev, thumbnail: url }));
    setUploading(false);
    e.target.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = (await Promise.all(files.map(uploadImage))).filter(Boolean) as string[];
    if (urls.length) setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (url: string) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((u) => u !== url) }));
    // Extract Cloudinary public_id: strip upload prefix, version, and extension
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    const key = match?.[1] ?? null;
    if (key) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      }).catch(() => {});
    }
  };

  const toggleVersionCollapse = (id: number) => {
    setCollapsedVersions((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleArrayChange = (field: "features" | "promotions", index: number, value: string) => {
    const list = [...(formData[field] as string[])];
    list[index] = value;
    setFormData({ ...formData, [field]: list });
  };

  const addArrayItem = (field: "features" | "promotions") => {
    setFormData({ ...formData, [field]: [...(formData[field] as string[]), ""] });
  };

  const removeArrayItem = (field: "features" | "promotions", index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field] as string[]).filter((_, i) => i !== index),
    });
  };

  const updateVersionSpec = (versionId: number, specField: keyof AdminVersion["specs"], value: string) => {
    setFormData({
      ...formData,
      versions: formData.versions.map((v) =>
        v.id === versionId ? { ...v, specs: { ...v.specs, [specField]: value } } : v
      ),
    });
  };

  const updateVersionName = (versionId: number, name: string) => {
    setFormData({
      ...formData,
      versions: formData.versions.map((v) =>
        v.id === versionId ? { ...v, name } : v
      ),
    });
  };

  const addVersion = () => {
    const newVersion: AdminVersion = {
      id: Date.now(),
      name: "",
      specs: { ...defaultSpecs },
      colors: [{ id: Date.now() + 1, name: "", price: 0 }],
    };
    setFormData({ ...formData, versions: [...formData.versions, newVersion] });
  };

  const removeVersion = (versionId: number) => {
    setFormData({
      ...formData,
      versions: formData.versions.filter((v) => v.id !== versionId),
    });
  };

  const updateColor = (versionId: number, colorId: number, field: "name" | "price", value: string | number) => {
    setFormData({
      ...formData,
      versions: formData.versions.map((v) => {
        if (v.id !== versionId) return v;
        return {
          ...v,
          colors: v.colors.map((c) =>
            c.id === colorId ? { ...c, [field]: value } : c
          ),
        };
      }),
    });
  };

  const addColor = (versionId: number) => {
    setFormData({
      ...formData,
      versions: formData.versions.map((v) => {
        if (v.id !== versionId) return v;
        return {
          ...v,
          colors: [...v.colors, { id: Date.now(), name: "", price: 0 }],
        };
      }),
    });
  };

  const removeColor = (versionId: number, colorId: number) => {
    setFormData({
      ...formData,
      versions: formData.versions.map((v) => {
        if (v.id !== versionId) return v;
        return { ...v, colors: v.colors.filter((c) => c.id !== colorId) };
      }),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {car ? "Chỉnh sửa thông tin xe" : "Khởi tạo thông tin xe"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5 pt-2">
          {(["info", "variants", "content"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "info" && "Thông tin chung"}
              {tab === "variants" && "Phiên bản & Màu sắc"}
              {tab === "content" && "Mô tả & Khuyến mãi"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
          {/* TAB: INFO */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên dòng xe *</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Ford Territory 2024"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ảnh đại diện (Thumbnail)
                </label>
                <div className="flex items-center gap-3">
                  {formData.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.thumbnail}
                      alt="thumbnail"
                      className="w-20 h-14 object-cover rounded border border-gray-200"
                    />
                  )}
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 text-sm text-gray-600 hover:text-blue-600 transition">
                    <ImageIcon className="w-4 h-4" />
                    {uploading ? "Đang tải..." : "Chọn ảnh"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                      disabled={uploading}
                    />
                  </label>
                  {formData.thumbnail && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, thumbnail: "" }))}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Xoá
                    </button>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Bộ ảnh gallery</label>
                  <label className="cursor-pointer text-blue-600 text-sm font-medium flex items-center hover:underline">
                    <Plus className="w-4 h-4 mr-1" />
                    {uploading ? "Đang tải..." : "Thêm ảnh"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {formData.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((url) => (
                      <div key={url} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="w-20 h-14 object-cover rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">Chưa có ảnh nào.</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags nổi bật (Nhấn Enter để thêm)
                </label>
                <div className="p-2 border border-gray-300 rounded-lg bg-white flex flex-wrap gap-2 items-center">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md flex items-center"
                    >
                      {tag}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                  <input
                    type="text"
                    className="flex-1 min-w-[150px] outline-none text-sm p-1"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Thêm tag..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Tính năng nổi bật</label>
                  <button
                    onClick={() => addArrayItem("features")}
                    className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm tính năng
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                        value={feature}
                        onChange={(e) => handleArrayChange("features", index, e.target.value)}
                        placeholder="VD: Ford Co-Pilot360..."
                      />
                      <button
                        onClick={() => removeArrayItem("features", index)}
                        className="text-red-400 p-2 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: VARIANTS */}
          {activeTab === "variants" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <div>
                  <h3 className="font-semibold text-gray-800">Danh sách Phiên bản & Màu sắc</h3>
                  <p className="text-sm text-gray-500">Mỗi phiên bản có thông số kỹ thuật và tuỳ chọn màu sắc riêng.</p>
                </div>
                <button
                  onClick={addVersion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm phiên bản
                </button>
              </div>

              {formData.versions.map((ver, vIndex) => {
                const isCollapsed = collapsedVersions.includes(ver.id);
                return (
                  <div
                    key={ver.id}
                    className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm relative"
                  >
                    <div className="absolute right-5 top-4 flex items-center space-x-1">
                      <button
                        onClick={() => toggleVersionCollapse(ver.id)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded transition"
                      >
                        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => removeVersion(ver.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <h4
                      className="font-bold text-gray-800 flex items-center cursor-pointer w-max select-none"
                      onClick={() => toggleVersionCollapse(ver.id)}
                    >
                      <span className="bg-blue-100 text-blue-800 w-6 h-6 flex items-center justify-center rounded-full text-sm mr-2">
                        {vIndex + 1}
                      </span>
                      Phiên bản:{" "}
                      <span className="ml-1 text-blue-600 font-medium">
                        {ver.name || "(Chưa đặt tên)"}
                      </span>
                    </h4>

                    {!isCollapsed && (
                      <div className="mt-5 border-t border-gray-100 pt-5">
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên phiên bản *
                          </label>
                          <input
                            type="text"
                            placeholder="VD: 2.0L Wildtrak"
                            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={ver.name}
                            onChange={(e) => updateVersionName(ver.id, e.target.value)}
                          />
                        </div>

                        <div className="mb-5 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                          <h5 className="text-sm font-semibold text-blue-800 mb-3">
                            Thông số kỹ thuật
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(
                              [
                                ["engine", "Động cơ", "VD: 2.0L Bi-Turbo Diesel"],
                                ["power", "Công suất", "VD: 210 mã lực"],
                                ["torque", "Mô-men xoắn", "VD: 500 Nm"],
                                ["transmission", "Hộp số", "VD: Tự động 10 cấp"],
                                ["fuel", "Tiêu thụ nhiên liệu", "VD: 8.2 L/100km"],
                                ["seats", "Số chỗ ngồi", "VD: 5"],
                                ["dimensions", "Kích thước (D x R x C)", "VD: 5370 x 1918 x 1884 mm"],
                              ] as [keyof AdminVersion["specs"], string, string][]
                            ).map(([field, label, placeholder]) => (
                              <div key={field}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  {label}
                                </label>
                                <input
                                  type="text"
                                  placeholder={placeholder}
                                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                                  value={ver.specs[field]}
                                  onChange={(e) => updateVersionSpec(ver.id, field, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-800">
                              Màu sắc & Giá
                            </span>
                            <button
                              onClick={() => addColor(ver.id)}
                              className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                            >
                              <Plus className="w-4 h-4 mr-1" /> Thêm màu
                            </button>
                          </div>
                          <div className="space-y-3">
                            {ver.colors.map((color) => (
                              <div
                                key={color.id}
                                className="flex gap-3 items-center bg-white p-2 rounded border border-gray-200 shadow-sm"
                              >
                                <input
                                  type="text"
                                  placeholder="Tên màu (VD: Trắng Arctic)"
                                  className="flex-1 p-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                                  value={color.name}
                                  onChange={(e) =>
                                    updateColor(ver.id, color.id, "name", e.target.value)
                                  }
                                />
                                <input
                                  type="number"
                                  placeholder="Giá (VNĐ)"
                                  className="flex-1 p-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                                  value={color.price || ""}
                                  onChange={(e) =>
                                    updateColor(ver.id, color.id, "price", Number(e.target.value))
                                  }
                                />
                                <button
                                  onClick={() => removeColor(ver.id, color.id)}
                                  className="text-red-400 p-2 hover:bg-red-50 rounded"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {formData.versions.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                  Xe chưa có phiên bản nào.{" "}
                  <span className="font-semibold text-blue-600">Thêm phiên bản</span> để bắt đầu.
                </div>
              )}
            </div>
          )}

          {/* TAB: CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Chương trình khuyến mãi
                  </label>
                  <button
                    onClick={() => addArrayItem("promotions")}
                    className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Thêm khuyến mãi
                  </button>
                </div>
                <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  {formData.promotions.map((p, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-orange-500 font-bold flex-shrink-0">🎁</span>
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                        value={p}
                        onChange={(e) => handleArrayChange("promotions", index, e.target.value)}
                        placeholder="VD: Giảm 50 triệu đồng tiền mặt..."
                      />
                      <button
                        onClick={() => removeArrayItem("promotions", index)}
                        className="text-red-400 p-2 hover:bg-red-50 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bài viết mô tả
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <div className="bg-gray-100 border-b border-gray-300 flex flex-wrap items-center p-2 gap-1">
                    <button
                      type="button"
                      title="In đậm"
                      onClick={() => applyInline("**")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="In nghiêng"
                      onClick={() => applyInline("*")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Gạch chân"
                      onClick={() => applyInline("<u>", "</u>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      title="Tiêu đề (##)"
                      onClick={() => applyLinePrefix("## ")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Danh sách gạch đầu dòng"
                      onClick={() => applyLinePrefix("- ")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Đoạn văn thường"
                      onClick={() => applyLinePrefix("")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      title="Chèn liên kết"
                      onClick={insertLink}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <label
                      title="Chèn ảnh"
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDescImageUpload}
                      />
                    </label>
                  </div>
                  <textarea
                    ref={descRef}
                    className="w-full p-4 min-h-[250px] outline-none resize-y text-sm leading-relaxed"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder={"Viết nội dung giới thiệu chi tiết về xe...\n\n## Tiêu đề phần\n\nĐoạn văn bình thường\n\n- Gạch đầu dòng 1\n- Gạch đầu dòng 2"}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Dùng toolbar để định dạng. <span className="font-mono">**in đậm**</span> · <span className="font-mono">*in nghiêng*</span> · <span className="font-mono">## Tiêu đề</span> · <span className="font-mono">- Danh sách</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 flex justify-end space-x-3 bg-white rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            Đóng
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
          >
            <Check className="w-4 h-4 mr-2" /> Lưu thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
