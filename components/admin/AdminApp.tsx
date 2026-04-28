"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  FileText,
  Settings,
  Menu,
  MessageCircle,
  LogOut,
} from "lucide-react";
import DashboardView from "./DashboardView";
import CarCatalogView from "./CarCatalogView";
import LeadsView from "./LeadsView";
import SettingsView from "./SettingsView";

type Tab = "dashboard" | "cars" | "leads" | "settings";

const tabLabels: Record<Tab, string> = {
  dashboard: "Dashboard Thống Kê",
  cars: "Quản lý Danh mục xe",
  leads: "Quản lý Báo giá & Lái thử",
  settings: "Cấu hình Website",
};

function NavItem({
  icon,
  label,
  active,
  onClick,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  open: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
          active
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
        {open && (
          <span className="ml-3 font-medium text-sm text-left flex-1">{label}</span>
        )}
      </button>
    </li>
  );
}

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.reload();
}

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "cars":
        return <CarCatalogView />;
      case "leads":
        return <LeadsView />;
      case "settings":
        return <SettingsView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col flex-shrink-0`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <Car className="text-blue-400 w-8 h-8 flex-shrink-0" />
          {sidebarOpen && (
            <span className="ml-3 font-bold text-xl tracking-wider">AUTO CMS</span>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            <NavItem
              icon={<LayoutDashboard />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
              open={sidebarOpen}
            />
            <NavItem
              icon={<Car />}
              label="Danh mục xe"
              active={activeTab === "cars"}
              onClick={() => setActiveTab("cars")}
              open={sidebarOpen}
            />
            <NavItem
              icon={<FileText />}
              label="Báo giá & Lái thử"
              active={activeTab === "leads"}
              onClick={() => setActiveTab("leads")}
              open={sidebarOpen}
            />
            <NavItem
              icon={<Settings />}
              label="Quản trị Website"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              open={sidebarOpen}
            />
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">
              AD
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-slate-400">Quản trị viên</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center text-slate-400 hover:text-white text-sm px-2 py-1.5 rounded hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between shadow-sm z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">
              {tabLabels[activeTab]}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Xem website →
            </a>
            <div className="relative">
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              <MessageCircle className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
