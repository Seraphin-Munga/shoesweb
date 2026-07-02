export type ApiColor = { id: number; name: string; hex: string };

export type ApiDiscount = {
  id: number;
  productId: number;
  label?: string;
  percent: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  discountedPrice: number;
};

export type ApiProduct = {
  id: number;
  name: string;
  brand: string;
  gender?: "Men" | "Women";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  bgColor: string;
  categoryId?: number;
  category?: string;
  imageUrls: string[];
  stockQuantity: number;
  isInStock: boolean;
  sizes: number[];
  colors: ApiColor[];
  // discount
  discountPercent?: number;
  discountedPrice?: number;
  discountLabel?: string;
  // detail only
  description?: string;
  features?: string[];
  isActive?: boolean;
  activeDiscount?: ApiDiscount;
  createdAt?: string;
};

export type ApiCategory = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
};

export type ApiColorFull = {
  id: number;
  name: string;
  hex: string;
  isActive: boolean;
  productCount: number;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
};

export type ProductQuery = {
  search?: string;
  category?: string;
  categoryId?: number;
  colorId?: number;
  priceRange?: string;  // "under150" | "150-200" | "over200"
  size?: number;
  inStock?: boolean;
  gender?: "Men" | "Women";
  sale?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
};

// 0=Pending 1=Processing 2=Shipped 3=Delivered 4=Cancelled
export type ApiOrderStatus = 0 | 1 | 2 | 3 | 4;

export type ApiOrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: number;
};

export type ApiOrder = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: ApiOrderItem[];
  totalAmount: number;
  status: ApiOrderStatus;
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: string;
  notes?: string;
};

export type OrderQuery = {
  search?: string;
  status?: ApiOrderStatus;
  page?: number;
  pageSize?: number;
};

export type UpsertDiscountPayload = {
  label?: string;
  percent: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
};

export type ApiMonthlyRevenue = {
  month: string;
  revenue: number;
};

export type ApiTopProduct = {
  id: number;
  name: string;
  reviewCount: number;
  rating: number;
  totalSales: number;
};

export type ApiDashboardOrderItem = {
  id: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  unitPrice: number;
  size: number;
  color: string;
  quantity: number;
  subtotal: number;
};

export type ApiDashboardOrder = {
  id: number;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  subTotal: number;
  shippingAmount: number;
  totalAmount: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  items: ApiDashboardOrderItem[];
  createdAt: string;
};

export type ApiDashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  monthlyRevenue: ApiMonthlyRevenue[];
  topProducts: ApiTopProduct[];
  recentOrders: ApiDashboardOrder[];
};

export type ApiMonthlyPerformance = {
  month: string;
  revenue: number;
  orders: number;
};

export type ApiStatusBreakdown = {
  status: string;
  label: string;
  count: number;
  percent: number;
};

export type ApiCategoryOverview = {
  name: string;
  productCount: number;
  avgPrice?: number;
};

export type ApiAnalyticsStats = {
  periodRevenue: number;
  totalOrders: number;
  avgMonthlyRevenue: number;
  periodLabel: string;
  monthlyPerformance: ApiMonthlyPerformance[];
  statusBreakdown: ApiStatusBreakdown[];
  categories: ApiCategoryOverview[];
};

export type ApiCustomer = {
  id: string;
  name: string;
  email: string;
  country: string;
  orderCount: number;
  totalSpent: number;
  tier: string;
  joinedAt: string;
};

export type ApiStoreSettings = {
  storeName: string;
  storeEmail: string;
  displayCurrency: string;
  usdToZarRate: number;
  freeShippingThresholdUsd: number;
  standardShippingFeeUsd: number;
  freeShippingThresholdZar: number;
  standardShippingFeeZar: number;
  newOrderAlerts: boolean;
  lowStockWarnings: boolean;
  customerReviews: boolean;
  dailyRevenueSummary: boolean;
  // Hero
  heroBadge: string;
  heroHeadline: string;
  heroAccent: string;
  heroSubtext: string;
  heroCta1Label: string;
  heroCta2Label: string;
  heroPromoLabel: string;
  heroPromoTitle: string;
  heroPromoBody: string;
  heroBestSellerName: string;
  heroBestSellerPrice: string;
};

export type ApiHeroContent = {
  badge: string;
  headline: string;
  accent: string;
  subtext: string;
  cta1Label: string;
  cta2Label: string;
  promoLabel: string;
  promoTitle: string;
  promoBody: string;
  bestSellerName: string;
  bestSellerPrice: string;
};

export type ApiSubscriber = {
  id: number;
  email: string;
  subscribedAt: string;
};

export type UpdateStoreSettingsPayload = {
  storeName?: string;
  storeEmail?: string;
  usdToZarRate?: number;
  freeShippingThresholdUsd?: number;
  standardShippingFeeUsd?: number;
  newOrderAlerts?: boolean;
  lowStockWarnings?: boolean;
  customerReviews?: boolean;
  dailyRevenueSummary?: boolean;
};
