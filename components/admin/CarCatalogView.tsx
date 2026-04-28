"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Lock, Unlock, AlertTriangle } from "lucide-react";
import { useStore, type AdminCar } from "@/lib/store";
import CarFormModal from "./CarFormModal";

export default function CarCatalogView() {
  const { adminCars, setAdminCars } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<AdminCar | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "delete" | "lock" | "unlock" | "";
    carId: string;
    carName: string;
  }>({ isOpen: false, type: "", carId: "", carName: "" });

  const filteredCars = adminCars.filter((car) =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (car: AdminCar | null = null) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleSaveCar = async (carData: AdminCar) => {
    try {
      if (editingCar) {
        const res = await fetch(`/api/cars/${carData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(carData),
        });
        if (res.ok) {
          const saved = await res.json();
          setAdminCars(adminCars.map((c) => (c.id === carData.id ? { ...carData, id: saved.id } : c)));
          setIsModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Lưu thất bại: ${err.error ?? res.status}`);
        }
      } else {
        const res = await fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(carData),
        });
        if (res.ok) {
          const saved = await res.json();
          setAdminCars([...adminCars, { ...carData, id: saved.id, locked: false }]);
          setIsModalOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          alert(`Lưu thất bại: ${err.error ?? res.status}`);
        }
      }
    } catch (err) {
      console.error("Failed to save car:", err);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const openConfirm = (type: "delete" | "lock" | "unlock", carId: string, carName: string) => {
    setConfirmModal({ isOpen: true, type, carId, carName });
  };

  const executeAction = async () => {
    const { type, carId } = confirmModal;
    setConfirmModal({ isOpen: false, type: "", carId: "", carName: "" });
    try {
      if (type === "delete") {
        const res = await fetch(`/api/cars/${carId}`, { method: "DELETE" });
        if (res.ok) setAdminCars(adminCars.filter((c) => c.id !== carId));
      } else if (type === "lock" || type === "unlock") {
        const locked = type === "lock";
        const res = await fetch(`/api/cars/${carId}/lock`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locked }),
        });
        if (res.ok) {
          setAdminCars(adminCars.map((c) => (c.id === carId ? { ...c, locked } : c)));
        }
      }
    } catch (err) {
      console.error("Failed to execute action:", err);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên xe..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm xe mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                <th className="py-3 px-4">Tên xe</th>
                <th className="py-3 px-4">Phiên bản</th>
                <th className="py-3 px-4">Màu sắc</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Không tìm thấy xe nào.
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr
                    key={car.id}
                    className={`hover:bg-gray-50 ${car.locked ? "bg-gray-100 opacity-60" : ""}`}
                  >
                    <td className="py-3 px-4 font-medium text-blue-600">{car.name}</td>
                    <td className="py-3 px-4 text-sm">{car.versions?.length || 0} bản</td>
                    <td className="py-3 px-4 text-sm">
                      {car.versions?.reduce(
                        (total, v) => total + (v.colors?.length || 0),
                        0
                      ) || 0}{" "}
                      tuỳ chọn
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {car.locked ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Lock className="w-3 h-3 mr-1" /> Đã khoá
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Unlock className="w-3 h-3 mr-1" /> Đang bán
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(car)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {car.locked ? (
                        <button
                          onClick={() => openConfirm("unlock", car.id, car.name)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Mở khoá"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirm("lock", car.id, car.name)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Khoá"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openConfirm("delete", car.id, car.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CarFormModal
          car={editingCar}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCar}
        />
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center mb-4 text-yellow-600">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Xác nhận thao tác</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn{" "}
              {confirmModal.type === "delete"
                ? "xoá"
                : confirmModal.type === "lock"
                ? "khoá"
                : "mở khoá"}{" "}
              xe <span className="font-bold">{confirmModal.carName}</span>?
              {confirmModal.type === "delete" && " Thao tác này không thể hoàn tác."}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setConfirmModal({ isOpen: false, type: "", carId: "", carName: "" })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  confirmModal.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
