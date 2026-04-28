export interface CarVariant {
  color: string;
  colorCode: string;
  colorImages?: string[];
  capacity: string;
  price: number;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  images: string[];
  thumbnail: string;
  variants: CarVariant[];
  features: string[];
  specifications: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuelConsumption: string;
    seats: number;
    dimensions: string;
  };
  description: string;
  descriptionImages?: string[];
  promotions: string[];
  isFeatured: boolean;
}

export const carCategories = [
  { id: "sedan", name: "Sedan" },
  { id: "suv", name: "SUV/Crossover" },
  { id: "hatchback", name: "Hatchback" },
  { id: "pickup", name: "Bán tải" },
  { id: "mpv", name: "MPV" },
];

export const cars: Car[] = [
  {
    id: "ford-ranger-wildtrak-2024",
    name: "Ford Ranger Wildtrak",
    brand: "Ford",
    category: "Bán tải",
    basePrice: 965000000,
    thumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    ],
    variants: [
      { 
        color: "Trắng Arctic", 
        colorCode: "#F0F0F0", 
        colorImages: [
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
        ],
        capacity: "2.0L XLS AT", 
        price: 659000000 
      },
      { 
        color: "Trắng Arctic", 
        colorCode: "#F0F0F0", 
        colorImages: [
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
        ],
        capacity: "2.0L XLT AT", 
        price: 799000000 
      },
      { 
        color: "Trắng Arctic", 
        colorCode: "#F0F0F0", 
        colorImages: [
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
        ],
        capacity: "2.0L Wildtrak", 
        price: 965000000 
      },
      { 
        color: "Cam Cyber", 
        colorCode: "#FF7518", 
        colorImages: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
          "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
        ],
        capacity: "2.0L Wildtrak", 
        price: 975000000 
      },
      { 
        color: "Xám Meteor", 
        colorCode: "#505050", 
        colorImages: [
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
        ],
        capacity: "2.0L XLT AT", 
        price: 799000000 
      },
      { 
        color: "Xám Meteor", 
        colorCode: "#505050", 
        colorImages: [
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
        ],
        capacity: "2.0L Wildtrak", 
        price: 965000000 
      },
      { 
        color: "Xanh Lightning", 
        colorCode: "#1E90FF", 
        colorImages: [
          "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
        ],
        capacity: "2.0L Wildtrak", 
        price: 975000000 
      },
    ],
    features: [
      "Ford Co-Pilot360",
      "SYNC 4 với màn hình 12 inch",
      "Ghế da cao cấp",
      "Hệ thống treo sau nhiều liên kết",
      "Chế độ lái địa hình",
      "Tải trọng 1 tấn",
    ],
    specifications: {
      engine: "2.0L Bi-Turbo Diesel",
      power: "210 mã lực",
      torque: "500 Nm",
      transmission: "Hộp số tự động 10 cấp",
      fuelConsumption: "8.2L/100km",
      seats: 5,
      dimensions: "5370 x 1918 x 1884 mm",
    },
    description: `Ford Ranger 2024 - Vua bán tải với sức mạnh vượt trội, khả năng off-road đỉnh cao và tiện nghi như SUV cao cấp.

## Thiết kế mạnh mẽ

Ranger 2024 với ngôn ngữ thiết kế mới, đầu xe hầm hố với lưới tản nhiệt cỡ lớn, đèn LED hình chữ C đặc trưng. Thân xe góc cạnh, vòm bánh rộng thể hiện sức mạnh.

## Nội thất SUV-like

Bảng điều khiển hoàn toàn mới với màn hình SYNC 4 12 inch dạng đứng, đồng hồ kỹ thuật số 12 inch. Ghế da cao cấp với chỉnh điện, sưởi/thông gió.

## Ford Co-Pilot360

- Phanh khẩn cấp tự động
- Hỗ trợ giữ làn
- Cảnh báo điểm mù
- Camera 360 độ với Trail View

## Động cơ Bi-Turbo

Động cơ 2.0L Bi-Turbo Diesel cho công suất 210 mã lực và mô-men xoắn khủng 500 Nm. Hộp số tự động 10 cấp SelectShift.`,
    descriptionImages: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
    ],
    promotions: [
      "Giảm 50 triệu đồng tiền mặt",
      "Tặng nắp thùng trị giá 30 triệu đồng",
      "Bảo hành 5 năm hoặc 150.000 km",
      "Hỗ trợ trả góp 90%",
    ],
    isFeatured: true,
  },
  {
    id: "ford-ranger-raptor-2024",
    name: "Ford Ranger Raptor",
    brand: "Ford",
    category: "Bán tải",
    basePrice: 1299000000,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
    ],
    variants: [
      { 
        color: "Xanh Performance Blue", 
        colorCode: "#0066CC", 
        colorImages: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
          "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
        ],
        capacity: "3.0L V6 EcoBoost", 
        price: 1299000000 
      },
      { 
        color: "Cam Code Orange", 
        colorCode: "#FF6600", 
        colorImages: [
          "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
        ],
        capacity: "3.0L V6 EcoBoost", 
        price: 1309000000 
      },
      { 
        color: "Đen Conquer Grey", 
        colorCode: "#2F2F2F", 
        colorImages: [
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
          "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80",
        ],
        capacity: "3.0L V6 EcoBoost", 
        price: 1299000000 
      },
    ],
    features: [
      "Động cơ V6 3.0L EcoBoost twin-turbo",
      "Hệ thống treo FOX Racing",
      "Chế độ Baja (đua địa hình)",
      "SYNC 4A với màn hình 12 inch",
      "Ghế Recaro thể thao",
      "Ống xả kép Performance",
    ],
    specifications: {
      engine: "3.0L V6 EcoBoost Twin-Turbo",
      power: "392 mã lực",
      torque: "583 Nm",
      transmission: "Hộp số tự động 10 cấp",
      fuelConsumption: "13.8L/100km",
      seats: 5,
      dimensions: "5430 x 2028 x 1922 mm",
    },
    description: `Ford Ranger Raptor 2024 - Siêu bán tải hiệu suất cao với khả năng off-road vượt trội và công nghệ đỉnh cao.

## Thiết kế đậm chất hiệu suất

Raptor sở hữu thiết kế hầm hố với lưới tản nhiệt FORD chữ in hoa đặc trưng, đèn LED Matrix, và vòm bánh mở rộng tích hợp hốc gió. Gầm xe được nâng cao đáng kể.

## Nội thất thể thao

Ghế Recaro thể thao bọc da/Alcantara, vô-lăng bọc da có dấu hiệu 12 giờ. Màn hình SYNC 4A 12 inch với điều khiển giọng nói tự nhiên.

## Hệ thống treo FOX Racing

- Giảm xóc Live Valve công nghệ nội bộ
- Hành trình treo trước 256mm, sau 290mm
- Thanh cân bằng Watt's Link

## Động cơ V6 EcoBoost

Động cơ 3.0L V6 twin-turbo cho công suất 392 mã lực và mô-men xoắn 583 Nm. Chế độ lái Baja cho phép nhảy địa hình.`,
    descriptionImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
    ],
    promotions: [
      "Tặng phụ kiện chính hãng trị giá 50 triệu đồng",
      "Bảo hành 5 năm không giới hạn km",
      "Hỗ trợ trả góp 85%",
      "Miễn phí bảo dưỡng 3 năm",
    ],
    isFeatured: true,
  },
  {
    id: "ford-everest-titanium-2024",
    name: "Ford Everest Titanium+",
    brand: "Ford",
    category: "SUV/Crossover",
    basePrice: 1499000000,
    thumbnail: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
      "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
    ],
    variants: [
      { 
        color: "Trắng Arctic", 
        colorCode: "#FAFAFA", 
        colorImages: [
          "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
        ],
        capacity: "2.0L Sport", 
        price: 1099000000 
      },
      { 
        color: "Trắng Arctic", 
        colorCode: "#FAFAFA", 
        colorImages: [
          "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
        ],
        capacity: "2.0L Titanium", 
        price: 1299000000 
      },
      { 
        color: "Trắng Arctic", 
        colorCode: "#FAFAFA", 
        colorImages: [
          "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
        ],
        capacity: "2.0L Titanium+", 
        price: 1499000000 
      },
      { 
        color: "Xám Meteor", 
        colorCode: "#4A4A4A", 
        colorImages: [
          "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
        ],
        capacity: "2.0L Titanium+", 
        price: 1499000000 
      },
      { 
        color: "Đen Absolute", 
        colorCode: "#1A1A1A", 
        colorImages: [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
          "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
        ],
        capacity: "2.0L Titanium+", 
        price: 1499000000 
      },
    ],
    features: [
      "Ford Co-Pilot360 2.0",
      "SYNC 4A với màn hình 12 inch",
      "Ghế da cao cấp chỉnh điện 10 hướng",
      "Hệ thống âm thanh B&O 12 loa",
      "Cửa sổ trời toàn cảnh",
      "Cốp điện chân đá",
    ],
    specifications: {
      engine: "2.0L Bi-Turbo Diesel",
      power: "210 mã lực",
      torque: "500 Nm",
      transmission: "Hộp số tự động 10 cấp",
      fuelConsumption: "8.0L/100km",
      seats: 7,
      dimensions: "4914 x 1923 x 1842 mm",
    },
    description: `Ford Everest 2024 - SUV 7 chỗ cao cấp với khả năng off-road đỉnh cao và tiện nghi sang trọng bậc nhất phân khúc.

## Thiết kế sang trọng và mạnh mẽ

Everest 2024 sở hữu ngôn ngữ thiết kế hiện đại với lưới tản nhiệt cỡ lớn, đèn LED Matrix thông minh. Thân xe dài rộng với vòm bánh góc cạnh thể hiện đẳng cấp.

## Nội thất đẳng cấp

Cabin bọc da cao cấp với hệ thống âm thanh B&O 12 loa. Màn hình SYNC 4A 12 inch, cụm đồng hồ kỹ thuật số 12.4 inch. Điều hòa tự động 3 vùng.

## Ford Co-Pilot360 2.0

- Kiểm soát hành trình thích ứng với Stop & Go
- Hỗ trợ giữ làn tích cực
- Phanh khẩn cấp với phát hiện người đi bộ
- Camera 360 độ với Trail View

## Động cơ và khả năng vận hành

Động cơ 2.0L Bi-Turbo Diesel cho công suất 210 mã lực. Hệ thống dẫn động 4WD với khóa vi sai cầu sau.`,
    descriptionImages: [
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
      "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
    ],
    promotions: [
      "Hỗ trợ 100% lệ phí trước bạ",
      "Tặng phụ kiện chính hãng trị giá 70 triệu đồng",
      "Bảo hành 5 năm hoặc 150.000 km",
      "Lãi suất vay ưu đãi từ 6.5%/năm",
    ],
    isFeatured: true,
  },
  {
    id: "ford-territory-2024",
    name: "Ford Territory",
    brand: "Ford",
    category: "SUV/Crossover",
    basePrice: 822000000,
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
      "https://images.unsplash.com/photo-1568844293986-8c2a5d2a8a1c?w=1200&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
    ],
    variants: [
      { 
        color: "Trắng Frozen", 
        colorCode: "#F8F8FF", 
        colorImages: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
          "https://images.unsplash.com/photo-1568844293986-8c2a5d2a8a1c?w=1200&q=80",
        ],
        capacity: "1.5T Trend", 
        price: 699000000 
      },
      { 
        color: "Trắng Frozen", 
        colorCode: "#F8F8FF", 
        colorImages: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
          "https://images.unsplash.com/photo-1568844293986-8c2a5d2a8a1c?w=1200&q=80",
        ],
        capacity: "1.5T Titanium", 
        price: 822000000 
      },
      { 
        color: "Đỏ Ruby", 
        colorCode: "#9B111E", 
        colorImages: [
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
        ],
        capacity: "1.5T Titanium", 
        price: 832000000 
      },
      { 
        color: "Xám Sterling", 
        colorCode: "#808080", 
        colorImages: [
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
        ],
        capacity: "1.5T Titanium", 
        price: 822000000 
      },
    ],
    features: [
      "Co-Pilot360",
      "Màn hình SYNC 3 10 inch",
      "Ghế da chỉnh điện 8 hướng",
      "Cửa sổ trời toàn cảnh",
      "Điều hòa tự động 2 vùng",
      "Sạc không dây",
    ],
    specifications: {
      engine: "1.5L EcoBoost Turbo",
      power: "143 mã lực",
      torque: "225 Nm",
      transmission: "CVT",
      fuelConsumption: "7.2L/100km",
      seats: 5,
      dimensions: "4630 x 1935 x 1706 mm",
    },
    description: `Ford Territory 2024 - SUV đô thị cỡ C với thiết kế hiện đại, trang bị tiện nghi và giá thành hợp lý.

## Thiết kế đô thị hiện đại

Territory sở hữu ngôn ngữ thiết kế trẻ trung với lưới tản nhiệt hình lục giác, đèn LED signature đặc trưng. Thân xe gọn gàng phù hợp di chuyển trong phố.

## Nội thất tiện nghi

Khoang cabin rộng rãi với màn hình SYNC 3 10 inch, điều hòa tự động 2 vùng. Ghế da chỉnh điện, cửa sổ trời toàn cảnh tạo không gian thoáng đãng.

## Hệ thống an toàn Co-Pilot360

- Cảnh báo va chạm phía trước
- Phanh khẩn cấp tự động
- Cảnh báo chệch làn đường
- Camera lùi HD

## Động cơ EcoBoost

Động cơ 1.5L Turbo EcoBoost cho công suất 143 mã lực, tiết kiệm nhiên liệu với mức tiêu thụ chỉ 7.2L/100km.`,
    descriptionImages: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
      "https://images.unsplash.com/photo-1568844293986-8c2a5d2a8a1c?w=1200&q=80",
    ],
    promotions: [
      "Giảm ngay 40 triệu đồng tiền mặt",
      "Tặng gói phụ kiện trị giá 25 triệu đồng",
      "Hỗ trợ trả góp 85%",
      "Bảo hành 3 năm hoặc 100.000 km",
    ],
    isFeatured: true,
  },
  {
    id: "ford-explorer-2024",
    name: "Ford Explorer Limited",
    brand: "Ford",
    category: "SUV/Crossover",
    basePrice: 2099000000,
    thumbnail: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
      "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    ],
    variants: [
      { 
        color: "Trắng Star", 
        colorCode: "#FFFAFA", 
        colorImages: [
          "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
          "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
        ],
        capacity: "2.3L Limited", 
        price: 2099000000 
      },
      { 
        color: "Đen Agate", 
        colorCode: "#0F0F0F", 
        colorImages: [
          "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
        ],
        capacity: "2.3L Limited", 
        price: 2099000000 
      },
      { 
        color: "Xanh Atlas", 
        colorCode: "#004B6B", 
        colorImages: [
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
          "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
        ],
        capacity: "2.3L Limited", 
        price: 2109000000 
      },
    ],
    features: [
      "Ford Co-Pilot360 Assist+",
      "SYNC 4 với màn hình 10.1 inch",
      "Ghế da cao cấp chỉnh điện 10 hướng có massage",
      "Hệ thống âm thanh B&O 14 loa",
      "Cửa sổ trời toàn cảnh 2 panel",
      "Đỗ xe tự động Active Park Assist 2.0",
    ],
    specifications: {
      engine: "2.3L EcoBoost Turbo",
      power: "300 mã lực",
      torque: "420 Nm",
      transmission: "Hộp số tự động 10 cấp",
      fuelConsumption: "10.2L/100km",
      seats: 7,
      dimensions: "5050 x 2004 x 1778 mm",
    },
    description: `Ford Explorer 2024 - SUV 7 chỗ cỡ lớn nhập khẩu Mỹ với trang bị cao cấp và động cơ mạnh mẽ.

## Thiết kế Mỹ đặc trưng

Explorer mang đậm phong cách SUV Mỹ với thân xe cỡ lớn, lưới tản nhiệt mạ chrome sang trọng, đèn Full LED và mâm 20 inch.

## Nội thất sang trọng

Khoang cabin rộng rãi với 3 hàng ghế bọc da cao cấp. Ghế lái chỉnh điện 10 hướng có massage, hệ thống âm thanh B&O 14 loa premium.

## Ford Co-Pilot360 Assist+

- Kiểm soát hành trình thích ứng
- Đỗ xe tự động Active Park Assist 2.0
- Hỗ trợ giữ làn nâng cao
- Cảnh báo điểm mù với hỗ trợ lái

## Động cơ EcoBoost mạnh mẽ

Động cơ 2.3L EcoBoost cho công suất 300 mã lực, mô-men xoắn 420 Nm. Hệ thống dẫn động 4WD thông minh.`,
    descriptionImages: [
      "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1200&q=80",
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1200&q=80",
      "https://images.unsplash.com/photo-1617654112368-307921291f42?w=1200&q=80",
    ],
    promotions: [
      "Tặng gói bảo dưỡng 5 năm trị giá 100 triệu đồng",
      "Tặng phụ kiện chính hãng cao cấp",
      "Hỗ trợ trả góp đến 80%",
      "Bảo hành 5 năm không giới hạn km",
    ],
    isFeatured: true,
  },
  {
    id: "ford-transit-2024",
    name: "Ford Transit Luxury",
    brand: "Ford",
    category: "MPV",
    basePrice: 905000000,
    thumbnail: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80",
    ],
    variants: [
      { 
        color: "Trắng Diamond", 
        colorCode: "#FEFEFE", 
        colorImages: [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
        ],
        capacity: "Mid", 
        price: 845000000 
      },
      { 
        color: "Trắng Diamond", 
        colorCode: "#FEFEFE", 
        colorImages: [
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
        ],
        capacity: "Luxury", 
        price: 905000000 
      },
      { 
        color: "Bạc Moondust", 
        colorCode: "#C0C0C0", 
        colorImages: [
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
          "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=80",
        ],
        capacity: "Luxury", 
        price: 905000000 
      },
    ],
    features: [
      "Ghế da cao cấp 16 chỗ",
      "Điều hòa kép độc lập",
      "Đèn LED toàn xe",
      "Camera lùi HD",
      "Hệ thống giải trí SYNC",
      "Cửa trượt điện",
    ],
    specifications: {
      engine: "2.4L Duratorq Diesel",
      power: "136 mã lực",
      torque: "375 Nm",
      transmission: "Hộp số sàn 6 cấp",
      fuelConsumption: "9.5L/100km",
      seats: 16,
      dimensions: "5981 x 2032 x 2545 mm",
    },
    description: `Ford Transit 2024 - Xe khách 16 chỗ cao cấp với tiện nghi vượt trội, phù hợp cho dịch vụ đưa đón và du lịch.

## Thiết kế thực dụng

Transit sở hữu thiết kế vuông vức thực dụng, tối ưu không gian nội thất. Cửa trượt điện tiện lợi, bậc lên xuống có đèn LED.

## Nội thất cao cấp

16 ghế da cao cấp với không gian để chân rộng rãi. Điều hòa kép độc lập cho hành khách, hệ thống giải trí với màn hình LCD.

## Trang bị an toàn

- Hệ thống chống bó cứng phanh ABS
- Hỗ trợ lực phanh khẩn cấp EBA
- Cân bằng điện tử ESP
- Camera lùi với cảm biến

## Động cơ Duratorq Diesel

Động cơ 2.4L Diesel cho công suất 136 mã lực, mô-men xoắn 375 Nm. Tiết kiệm nhiên liệu và bền bỉ.`,
    descriptionImages: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    ],
    promotions: [
      "Giảm 30 triệu đồng tiền mặt",
      "Tặng gói phụ kiện business",
      "Hỗ trợ trả góp 90%",
      "Bảo hành 3 năm hoặc 100.000 km",
    ],
    isFeatured: true,
  },
];

export const sliderImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    title: "Ford Ranger Raptor 2024",
    subtitle: "Siêu bán tải hiệu suất cao - Khơi dậy bản năng chinh phục",
    carId: "ford-ranger-raptor-2024",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=1920&q=80",
    title: "Ford Everest Titanium+",
    subtitle: "SUV 7 chỗ cao cấp - Đẳng cấp vượt mọi địa hình",
    carId: "ford-everest-titanium-2024",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80",
    title: "Ford Ranger Wildtrak",
    subtitle: "Vua bán tải - Công nghệ dẫn đầu, sức mạnh vượt trội",
    carId: "ford-ranger-wildtrak-2024",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1920&q=80",
    title: "Ford Explorer Limited",
    subtitle: "SUV Mỹ đích thực - Sang trọng, mạnh mẽ, đẳng cấp",
    carId: "ford-explorer-2024",
  },
];

export const storeInfo = {
  name: "FORD AUTO STAR",
  address: "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
  hotline: "0909 123 456",
  email: "info@fordautostar.vn",
  facebook: "https://facebook.com/fordautostar",
  zalo: "https://zalo.me/0909123456",
  workingHours: "8:00 - 18:00 (Thứ 2 - Chủ nhật)",
};

export function getCarById(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}

export function getFeaturedCars(): Car[] {
  return cars.filter((car) => car.isFeatured);
}

export function getCarsByBrand(brand: string): Car[] {
  return cars.filter((car) => car.brand === brand);
}

export function getCarsByCategory(category: string): Car[] {
  return cars.filter((car) => car.category.toLowerCase() === category.toLowerCase());
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}
