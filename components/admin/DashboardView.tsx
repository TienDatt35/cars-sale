"use client";

import { Eye, FileText, Car, Check } from "lucide-react";

const stats = {
  visits: 12450,
  leads: 342,
  topCars: [
    { name: "Ford Ranger Wildtrak", views: 3200, percentage: 85 },
    { name: "Ford Ranger Raptor", views: 2800, percentage: 70 },
    { name: "Ford Everest Titanium+", views: 2100, percentage: 55 },
    { name: "Ford Territory", views: 1800, percentage: 45 },
  ],
  topPrices: [
    { range: "800 triệu - 1 tỷ", count: 450, percentage: 90 },
    { range: "1 - 1.5 tỷ", count: 320, percentage: 65 },
    { range: "1.5 - 2 tỷ", count: 210, percentage: 40 },
    { range: "Trên 2 tỷ", count: 150, percentage: 30 },
  ],
};

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`p-6 rounded-xl border ${color} shadow-sm flex items-center space-x-4`}>
      <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
      </div>
    </div>
  );
}

export default function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Lượt truy cập"
          value={stats.visits.toLocaleString()}
          icon={<Eye className="text-blue-500" />}
          color="bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Yêu cầu Báo giá & Lái thử"
          value={stats.leads}
          icon={<FileText className="text-green-500" />}
          color="bg-green-50 border-green-100"
        />
        <StatCard
          title="Xe trong kho"
          value="128"
          icon={<Car className="text-purple-500" />}
          color="bg-purple-50 border-purple-100"
        />
        <StatCard
          title="Tỷ lệ chuyển đổi"
          value="4.5%"
          icon={<Check className="text-orange-500" />}
          color="bg-orange-50 border-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Top xe được quan tâm nhất
          </h3>
          <div className="space-y-4">
            {stats.topCars.map((car, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{car.name}</span>
                  <span className="text-gray-500">{car.views.toLocaleString()} lượt xem</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${car.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Mức giá được tìm hiểu nhiều
          </h3>
          <div className="space-y-4">
            {stats.topPrices.map((price, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{price.range}</span>
                  <span className="text-gray-500">{price.count} lượt tìm</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${price.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
