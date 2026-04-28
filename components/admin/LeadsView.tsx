"use client";

import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useStore, type Lead } from "@/lib/store";

const statusColor = (status: string) => {
  switch (status) {
    case "Chưa hỗ trợ":
      return "bg-red-100 text-red-700 border-red-200";
    case "Đang hỗ trợ":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Đã hỗ trợ":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function LeadsView() {
  const { leads, setLeads } = useStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/leads")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(
            data.map((l) => ({
              ...l,
              date: new Date(l.createdAt).toLocaleDateString("vi-VN"),
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [setLeads]);

  const updateStatus = async (id: string, newStatus: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: newStatus });
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(console.error);
  };

  return (
    <div className="space-y-4 relative">
      {isLoading && (
        <div className="text-sm text-gray-500 text-center py-2">Đang tải...</div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                <th className="py-3 px-4">Loại YC</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Số điện thoại</th>
                <th className="py-3 px-4">Xe quan tâm</th>
                <th className="py-3 px-4">Ngày ĐK</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        lead.type === "Báo giá"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lead.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{lead.name}</td>
                  <td className="py-3 px-4 text-sm">{lead.phone}</td>
                  <td className="py-3 px-4 text-sm font-medium text-blue-600">{lead.car}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{lead.date}</td>
                  <td className="py-3 px-4">
                    <select
                      className={`text-xs font-medium px-2 py-1 rounded border outline-none ${statusColor(lead.status)}`}
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                    >
                      <option value="Chưa hỗ trợ">Chưa hỗ trợ</option>
                      <option value="Đang hỗ trợ">Đang hỗ trợ</option>
                      <option value="Đã hỗ trợ">Đã hỗ trợ</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800">Chi tiết đăng ký</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                ["Loại Yêu Cầu", selectedLead.type],
                ["Họ và Tên", selectedLead.name],
                ["Số điện thoại", selectedLead.phone],
                ["Dòng xe", selectedLead.car],
                ["Thanh toán", selectedLead.payment],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="col-span-2 font-medium">{value}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-sm text-gray-500">Trạng thái</span>
                <div className="col-span-2">
                  <select
                    className={`text-sm font-medium px-3 py-1.5 rounded border w-full outline-none ${statusColor(selectedLead.status)}`}
                    value={selectedLead.status}
                    onChange={(e) => updateStatus(selectedLead.id, e.target.value)}
                  >
                    <option value="Chưa hỗ trợ">Chưa hỗ trợ</option>
                    <option value="Đang hỗ trợ">Đang hỗ trợ</option>
                    <option value="Đã hỗ trợ">Đã hỗ trợ</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
