import type {
  ApiProduct, ApiCategory, ApiColorFull, ApiDiscount,
  ApiResponse, PagedResult, ProductQuery, UpsertDiscountPayload,
  ApiOrder, OrderQuery, ApiDashboardStats, ApiAnalyticsStats, ApiCustomer,
  ApiStoreSettings, UpdateStoreSettingsPayload, ApiSubscriber, ApiHeroContent,
  CreateOrderPayload, ApiPromoCode, CreatePromoCodePayload, ValidatePromoResponse,
  ApiUserOrder,
} from "./types";

export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api";

async function get<T>(path: string, token?: string): Promise<T> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  // Always cache: "no-store", using next:{revalidate} here marks the module as
  // server-only in Turbopack, breaking every client-side import of this file.
  const res = await fetch(`${BASE}${path}`, { cache: "no-store", headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

async function req<T>(method: string, path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ── Products ─────────────────────────────────────────────
export async function fetchProducts(query: ProductQuery = {}): Promise<PagedResult<ApiProduct>> {
  const params = new URLSearchParams();
  if (query.search)     params.set("search",     query.search);
  if (query.category)   params.set("category",   query.category);
  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  if (query.colorId)    params.set("colorId",    String(query.colorId));
  if (query.priceRange) params.set("priceRange",  query.priceRange);
  if (query.size)       params.set("size",        String(query.size));
  if (query.inStock)    params.set("inStock",     "true");
  if (query.gender)     params.set("gender",      query.gender);
  if (query.sale)       params.set("sale",        "true");
  if (query.sort)       params.set("sort",        query.sort);
  if (query.page)       params.set("page",        String(query.page));
  if (query.pageSize)   params.set("pageSize",    String(query.pageSize));
  const qs = params.toString();
  return get<PagedResult<ApiProduct>>(`/products${qs ? `?${qs}` : ""}`);
}

export async function fetchProduct(id: number): Promise<ApiProduct> {
  return get<ApiProduct>(`/products/${id}`);
}

export async function fetchRelated(id: number, limit = 4): Promise<ApiProduct[]> {
  return get<ApiProduct[]>(`/products/${id}/related?limit=${limit}`);
}

export async function searchProducts(q: string, limit = 8): Promise<ApiProduct[]> {
  if (!q.trim()) return [];
  const result = await fetchProducts({ search: q, pageSize: limit, sort: "popular" });
  return result.items;
}

export async function adminCreateProduct(data: unknown, token: string) {
  return req<ApiProduct>("POST", "/products", data, token);
}

export async function adminUpdateProduct(id: number, data: unknown, token: string) {
  return req<ApiProduct>("PUT", `/products/${id}`, data, token);
}

export async function adminDeleteProduct(id: number, token: string) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function adminUploadProductImage(id: number, file: File, token: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/products/${id}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.imageUrl;
}

export async function adminUploadProductImages(id: number, files: (File | null)[], token: string): Promise<string[]> {
  const form = new FormData();
  files.forEach((f) => { if (f) form.append("files", f); });
  if (!form.has("files")) return [];
  const res = await fetch(`${BASE}/products/${id}/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return (json.data.images as string[]) ?? [];
}

// ── Discounts ─────────────────────────────────────────────
export async function adminUpsertDiscount(productId: number, data: UpsertDiscountPayload, token: string): Promise<ApiDiscount> {
  return req<ApiDiscount>("POST", `/products/${productId}/discount`, data, token);
}

export async function adminRemoveDiscount(productId: number, token: string) {
  const res = await fetch(`${BASE}/products/${productId}/discount`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

// ── Categories ────────────────────────────────────────────
export async function fetchCategories(): Promise<ApiCategory[]> {
  return get<ApiCategory[]>("/categories");
}

export async function adminCreateCategory(data: { name: string; description?: string; isActive: boolean; sortOrder: number }, token: string): Promise<ApiCategory> {
  return req<ApiCategory>("POST", "/categories", data, token);
}

export async function adminUpdateCategory(id: number, data: { name?: string; description?: string; isActive?: boolean; sortOrder?: number }, token: string): Promise<ApiCategory> {
  return req<ApiCategory>("PUT", `/categories/${id}`, data, token);
}

export async function adminDeleteCategory(id: number, token: string) {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function adminUploadCategoryImage(id: number, file: File, token: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/categories/${id}/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.imageUrl as string;
}

// ── Colors ────────────────────────────────────────────────
export async function fetchColors(): Promise<ApiColorFull[]> {
  return get<ApiColorFull[]>("/colors");
}

export async function adminCreateColor(data: { name: string; hex: string; isActive: boolean }, token: string): Promise<ApiColorFull> {
  return req<ApiColorFull>("POST", "/colors", data, token);
}

export async function adminUpdateColor(id: number, data: { name?: string; hex?: string; isActive?: boolean }, token: string): Promise<ApiColorFull> {
  return req<ApiColorFull>("PUT", `/colors/${id}`, data, token);
}

export async function adminDeleteColor(id: number, token: string) {
  const res = await fetch(`${BASE}/colors/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

// ── Orders ────────────────────────────────────────────────
export async function fetchOrders(query: OrderQuery = {}, token?: string): Promise<PagedResult<ApiOrder>> {
  const params = new URLSearchParams();
  if (query.search   != null) params.set("search",   query.search);
  if (query.status   != null) params.set("status",   String(query.status));
  if (query.page     != null) params.set("page",     String(query.page));
  if (query.pageSize != null) params.set("pageSize", String(query.pageSize));
  const qs = params.toString();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE}/orders${qs ? `?${qs}` : ""}`, { headers });
  if (!res.ok) throw new Error(`API ${res.status}: /orders`);
  const json: ApiResponse<PagedResult<ApiOrder>> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ── Customer order tracking ───────────────────────────────
export async function fetchMyOrders(token: string): Promise<ApiUserOrder[]> {
  return get<ApiUserOrder[]>("/orders/my", token);
}

export async function fetchMyOrder(id: number, token: string): Promise<ApiUserOrder> {
  return get<ApiUserOrder>(`/orders/${id}`, token);
}

export async function adminUpdateOrderStatus(id: number, status: number, token: string): Promise<ApiOrder> {
  return req<ApiOrder>("PATCH", `/orders/${id}/status`, { status }, token);
}

export async function createOrder(data: CreateOrderPayload, token?: string): Promise<ApiOrder> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  const json: ApiResponse<ApiOrder> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ── Admin dashboard ───────────────────────────────────────
export async function fetchAdminDashboard(token: string): Promise<ApiDashboardStats> {
  return get<ApiDashboardStats>("/admin/dashboard", token);
}

export async function fetchAdminAnalytics(token: string): Promise<ApiAnalyticsStats> {
  return get<ApiAnalyticsStats>("/admin/analytics", token);
}

export async function fetchAdminCustomers(token: string): Promise<ApiCustomer[]> {
  return get<ApiCustomer[]>("/admin/customers", token);
}

export async function fetchAdminSettings(token: string): Promise<ApiStoreSettings> {
  return get<ApiStoreSettings>("/admin/settings", token);
}

export async function updateAdminSettings(
  data: UpdateStoreSettingsPayload,
  token: string,
): Promise<ApiStoreSettings> {
  return req<ApiStoreSettings>("PUT", "/admin/settings", data, token);
}

// ── Hero ──────────────────────────────────────────────────
export async function fetchHeroContent(): Promise<ApiHeroContent> {
  return get<ApiHeroContent>("/hero");
}

export async function adminUploadHeroBanner(file: File, token: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/admin/hero/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "Upload failed");
  return (json.data.imageUrl ?? json.data.url ?? "") as string;
}

export async function adminUpdateHero(data: Partial<ApiHeroContent>, token: string): Promise<ApiStoreSettings> {
  const payload = {
    heroBadge:           data.badge,
    heroHeadline:        data.headline,
    heroAccent:          data.accent,
    heroSubtext:         data.subtext,
    heroCta1Label:       data.cta1Label,
    heroCta1Url:         data.cta1Url,
    heroCta2Label:       data.cta2Label,
    heroCta2Url:         data.cta2Url,
    heroPromoLabel:      data.promoLabel,
    heroPromoTitle:      data.promoTitle,
    heroPromoBody:       data.promoBody,
    heroBestSellerName:  data.bestSellerName,
    heroBestSellerPrice: data.bestSellerPrice,
    heroBannerImageUrl:  data.bannerImageUrl,
  };
  return req<ApiStoreSettings>("PUT", "/admin/settings", payload, token);
}

// ── Subscribers ───────────────────────────────────────────
export async function subscribeNewsletter(email: string): Promise<ApiSubscriber> {
  const res = await fetch(`${BASE}/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const json: ApiResponse<ApiSubscriber> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function fetchSubscribers(token: string): Promise<ApiSubscriber[]> {
  return get<ApiSubscriber[]>("/subscribers", token);
}

export async function deleteSubscriber(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/subscribers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function deleteAllSubscribers(token: string): Promise<void> {
  const res = await fetch(`${BASE}/subscribers`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

// ── Promo Codes ───────────────────────────────────────────
export async function fetchPromoCodes(token: string): Promise<ApiPromoCode[]> {
  return get<ApiPromoCode[]>("/promo-codes", token);
}

export async function adminCreatePromoCode(data: CreatePromoCodePayload, token: string): Promise<ApiPromoCode> {
  return req<ApiPromoCode>("POST", "/promo-codes", data, token);
}

export async function adminUpdatePromoCode(id: number, data: Partial<CreatePromoCodePayload>, token: string): Promise<ApiPromoCode> {
  return req<ApiPromoCode>("PUT", `/promo-codes/${id}`, data, token);
}

export async function adminDeletePromoCode(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/promo-codes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function validatePromoCode(code: string, orderTotalZar: number): Promise<ValidatePromoResponse> {
  const res = await fetch(`${BASE}/promo-codes/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, orderTotalZar }),
  });
  const json: ApiResponse<ValidatePromoResponse> = await res.json();
  if (!json.success) return { valid: false, message: json.message ?? "Invalid code" };
  return json.data;
}

// ── Auth ─────────────────────────────────────────────────
export async function registerApi(firstName: string, lastName: string, email: string, password: string) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password, confirmPassword: password }),
  });
  const json: ApiResponse<{
    accessToken: string; refreshToken: string;
    user: { firstName: string; lastName: string; email: string; role: string };
  }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json: ApiResponse<{
    accessToken: string; refreshToken: string;
    user: { firstName: string; lastName: string; email: string; role: string };
  }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function forgotPasswordApi(email: string) {
  const res = await fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const json: ApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function resetPasswordApi(email: string, token: string, newPassword: string) {
  const res = await fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token, newPassword }),
  });
  const json: ApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function sendOtpApi(email: string) {
  const res = await fetch(`${BASE}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const json: ApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function verifyOtpApi(email: string, code: string) {
  const res = await fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const json: ApiResponse<null> = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function refreshTokenApi(accessToken: string, refreshToken: string) {
  const res = await fetch(`${BASE}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken, refreshToken }),
  });
  const json: ApiResponse<{ accessToken: string; refreshToken: string; accessTokenExpiry: string }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
