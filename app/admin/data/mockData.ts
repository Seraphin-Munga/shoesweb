export type OrderStatus = "delivered" | "shipped" | "processing" | "pending" | "cancelled";

export type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  productId: number;
  size: number;
  qty: number;
  date: string;
  amount: number;
  status: OrderStatus;
  country: string;
};

export const ORDERS: Order[] = [
  { id: "ORD-2841", customer: "James Rodriguez",  email: "james.r@email.com",   product: "Air Vortex Pro",    productId: 1, size: 10, qty: 1, date: "2026-06-28", amount: 189.99, status: "delivered",  country: "US" },
  { id: "ORD-2840", customer: "Sarah Chen",        email: "sarah.c@email.com",   product: "Classic Luxe",      productId: 3, size: 8,  qty: 1, date: "2026-06-27", amount: 279.99, status: "shipped",    country: "CA" },
  { id: "ORD-2839", customer: "Marcus Thompson",   email: "marcus.t@email.com",  product: "Night Runner Dark", productId: 8, size: 11, qty: 1, date: "2026-06-27", amount: 244.00, status: "processing", country: "UK" },
  { id: "ORD-2838", customer: "Aisha Kowalski",    email: "aisha.k@email.com",   product: "Urban Runner X",    productId: 2, size: 7,  qty: 2, date: "2026-06-26", amount: 299.98, status: "delivered",  country: "DE" },
  { id: "ORD-2837", customer: "Leo Burnett",       email: "leo.b@email.com",     product: "Trail Blazer GTX",  productId: 6, size: 9,  qty: 1, date: "2026-06-25", amount: 199.99, status: "shipped",    country: "AU" },
  { id: "ORD-2836", customer: "Priya Sharma",      email: "priya.s@email.com",   product: "Cloud Walk Elite",  productId: 5, size: 6,  qty: 1, date: "2026-06-24", amount: 259.99, status: "delivered",  country: "IN" },
  { id: "ORD-2835", customer: "Tyler Conrad",      email: "tyler.c@email.com",   product: "Street Edge V2",    productId: 4, size: 12, qty: 1, date: "2026-06-23", amount: 174.99, status: "delivered",  country: "US" },
  { id: "ORD-2834", customer: "Emma Larsson",      email: "emma.l@email.com",    product: "Velocity Sprint",   productId: 7, size: 8,  qty: 1, date: "2026-06-22", amount: 134.99, status: "cancelled",  country: "SE" },
  { id: "ORD-2833", customer: "Owen Kim",          email: "owen.k@email.com",    product: "Air Vortex Pro",    productId: 1, size: 9,  qty: 1, date: "2026-06-21", amount: 189.99, status: "delivered",  country: "KR" },
  { id: "ORD-2832", customer: "Rebecca Foster",    email: "becca.f@email.com",   product: "Classic Luxe",      productId: 3, size: 7,  qty: 1, date: "2026-06-20", amount: 279.99, status: "delivered",  country: "US" },
  { id: "ORD-2831", customer: "David Mensah",      email: "david.m@email.com",   product: "Night Runner Dark", productId: 8, size: 10, qty: 1, date: "2026-06-19", amount: 244.00, status: "pending",    country: "GH" },
  { id: "ORD-2830", customer: "Clara Dubois",      email: "clara.d@email.com",   product: "Trail Blazer GTX",  productId: 6, size: 8,  qty: 2, date: "2026-06-18", amount: 399.98, status: "delivered",  country: "FR" },
  { id: "ORD-2829", customer: "Hassan Osei",       email: "hassan.o@email.com",  product: "Urban Runner X",    productId: 2, size: 11, qty: 1, date: "2026-06-17", amount: 149.99, status: "shipped",    country: "NG" },
  { id: "ORD-2828", customer: "Nina Jensen",       email: "nina.j@email.com",    product: "Cloud Walk Elite",  productId: 5, size: 7,  qty: 1, date: "2026-06-16", amount: 259.99, status: "delivered",  country: "DK" },
  { id: "ORD-2827", customer: "Sam Peterson",      email: "sam.p@email.com",     product: "Velocity Sprint",   productId: 7, size: 10, qty: 3, date: "2026-06-15", amount: 404.97, status: "delivered",  country: "US" },
];

export type RevenueDataPoint = { month: string; revenue: number; orders: number };

export const MONTHLY_REVENUE: RevenueDataPoint[] = [
  { month: "Jan", revenue: 12400, orders: 68  },
  { month: "Feb", revenue: 18200, orders: 94  },
  { month: "Mar", revenue: 14800, orders: 76  },
  { month: "Apr", revenue: 21600, orders: 112 },
  { month: "May", revenue: 19300, orders: 98  },
  { month: "Jun", revenue: 24800, orders: 127 },
];

export const STATS = {
  totalRevenue: 47832,
  revenueGrowth: 12.5,
  totalOrders: 284,
  ordersGrowth: 8.2,
  totalCustomers: 1429,
  customersGrowth: 3.7,
  avgOrderValue: 168.42,
  avgOrderGrowth: 4.1,
};

export const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  delivered:  { label: "Delivered",  bg: "bg-green-50",  text: "text-green-700" },
  shipped:    { label: "Shipped",    bg: "bg-blue-50",   text: "text-blue-700"  },
  processing: { label: "Processing", bg: "bg-amber-50",  text: "text-amber-700" },
  pending:    { label: "Pending",    bg: "bg-zinc-100",  text: "text-zinc-600"  },
  cancelled:  { label: "Cancelled",  bg: "bg-red-50",    text: "text-red-600"   },
};
