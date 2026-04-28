"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { cars as staticCars, storeInfo, type Car, type CarVariant } from "./car-data";

export interface AdminColor {
  id: number;
  name: string;
  colorCode?: string;
  colorImages?: string[];
  price: number;
}

export interface AdminVersion {
  id: number;
  name: string;
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuel: string;
    seats: string;
    dimensions: string;
  };
  colors: AdminColor[];
}

export interface AdminCar extends Omit<Car, "variants"> {
  locked: boolean;
  tags: string[];
  versions: AdminVersion[];
}

export interface Lead {
  id: string;
  type: string;
  name: string;
  phone: string;
  car: string;
  payment: string;
  status: string;
  date: string;
  createdAt?: string;
}

export interface StoreSettings {
  address: string;
  hotline: string;
  email: string;
  facebook: string;
  zalo: string;
  map: string;
}

// ─── Converters ──────────────────────────────────────────────────────────────

export function webCarToAdminCar(car: Car): AdminCar {
  const versionMap = new Map<string, AdminColor[]>();
  car.variants.forEach((v, idx) => {
    if (!versionMap.has(v.capacity)) versionMap.set(v.capacity, []);
    versionMap.get(v.capacity)!.push({
      id: idx + 1,
      name: v.color,
      colorCode: v.colorCode,
      colorImages: v.colorImages,
      price: v.price,
    });
  });

  const versions: AdminVersion[] = Array.from(versionMap.entries()).map(
    ([capacity, colors], idx) => ({
      id: idx + 1,
      name: capacity,
      specs: {
        engine: car.specifications.engine,
        power: car.specifications.power,
        torque: car.specifications.torque,
        transmission: car.specifications.transmission,
        fuel: car.specifications.fuelConsumption,
        seats: String(car.specifications.seats),
        dimensions: car.specifications.dimensions,
      },
      colors,
    })
  );

  return { ...car, locked: false, tags: [car.category, car.brand], versions };
}

export function adminCarToWebCar(adminCar: AdminCar): Car {
  const variants: CarVariant[] = adminCar.versions.flatMap((ver) =>
    ver.colors.map((c) => ({
      color: c.name,
      colorCode: c.colorCode || "#888888",
      colorImages: c.colorImages,
      capacity: ver.name,
      price: Number(c.price),
    }))
  );

  const allPrices = variants.map((v) => v.price).filter((p) => p > 0);
  const basePrice = allPrices.length > 0 ? Math.min(...allPrices) : adminCar.basePrice;

  return {
    id: adminCar.id,
    name: adminCar.name,
    brand: adminCar.brand,
    category: adminCar.category,
    basePrice,
    images: adminCar.images,
    thumbnail: adminCar.thumbnail,
    variants,
    features: adminCar.features,
    specifications: adminCar.specifications,
    description: adminCar.description,
    descriptionImages: adminCar.descriptionImages,
    promotions: adminCar.promotions,
    isFeatured: adminCar.isFeatured,
  };
}

// Convert a raw DB car (with versions[]{colors[]}) to AdminCar shape
function dbCarToAdminCar(dbCar: {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  thumbnail: string;
  images: string[];
  features: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specifications: any;
  description: string;
  descriptionImages: string[];
  promotions: string[];
  isFeatured: boolean;
  locked: boolean;
  tags: string[];
  versions: {
    id: number;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    specs: any;
    order: number;
    colors: { id: number; name: string; colorCode: string; colorImages: string[]; price: number }[];
  }[];
}): AdminCar {
  return {
    id: dbCar.id,
    name: dbCar.name,
    brand: dbCar.brand,
    category: dbCar.category,
    basePrice: dbCar.basePrice,
    thumbnail: dbCar.thumbnail,
    images: dbCar.images,
    features: dbCar.features,
    specifications: dbCar.specifications,
    description: dbCar.description,
    descriptionImages: dbCar.descriptionImages,
    promotions: dbCar.promotions,
    isFeatured: dbCar.isFeatured,
    locked: dbCar.locked,
    tags: dbCar.tags,
    versions: dbCar.versions.map((ver) => ({
      id: ver.id,
      name: ver.name,
      specs: ver.specs,
      colors: ver.colors.map((c) => ({
        id: c.id,
        name: c.name,
        colorCode: c.colorCode,
        colorImages: c.colorImages,
        price: c.price,
      })),
    })),
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface StoreContextValue {
  adminCars: AdminCar[];
  setAdminCars: React.Dispatch<React.SetStateAction<AdminCar[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  isLoadingCars: boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const defaultSettings: StoreSettings = {
  address: storeInfo.address,
  hotline: storeInfo.hotline,
  email: storeInfo.email,
  facebook: storeInfo.facebook,
  zalo: storeInfo.zalo,
  map: "https://maps.google.com/?q=123+Nguyen+Van+Linh",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [adminCars, setAdminCars] = useState<AdminCar[]>(() =>
    staticCars.map(webCarToAdminCar)
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoadingCars, setIsLoadingCars] = useState(false);

  // Fetch cars from API on mount; fall back to static data if API unavailable
  useEffect(() => {
    setIsLoadingCars(true);
    fetch("/api/cars")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAdminCars(data.map(dbCarToAdminCar));
        }
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setIsLoadingCars(false));
  }, []);

  // Fetch settings from API on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  return (
    <StoreContext.Provider
      value={{ adminCars, setAdminCars, leads, setLeads, settings, setSettings, isLoadingCars }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
