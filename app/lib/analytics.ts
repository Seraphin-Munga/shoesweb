declare function gtag(...args: unknown[]): void;

export function trackViewItem(product: {
  id: number;
  name: string;
  brand?: string;
  price: number;
}) {
  if (typeof window === "undefined" || typeof gtag === "undefined") return;
  gtag("event", "view_item", {
    currency: "ZAR",
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_brand: product.brand ?? "",
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: number;
  name: string;
  brand?: string;
  price: number;
}, size: number, color: string, qty: number) {
  if (typeof window === "undefined" || typeof gtag === "undefined") return;
  gtag("event", "add_to_cart", {
    currency: "ZAR",
    value: product.price * qty,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_brand: product.brand ?? "",
        item_variant: `${size} / ${color}`,
        price: product.price,
        quantity: qty,
      },
    ],
  });
}

export function trackBeginCheckout(
  items: { id: number; name: string; price: number; quantity: number; size: number; color: string }[],
  total: number,
) {
  if (typeof window === "undefined" || typeof gtag === "undefined") return;
  gtag("event", "begin_checkout", {
    currency: "ZAR",
    value: total,
    items: items.map((i) => ({
      item_id: String(i.id),
      item_name: i.name,
      item_variant: `${i.size} / ${i.color}`,
      price: i.price,
      quantity: i.quantity,
    })),
  });
}

export function trackPurchase(order: {
  id: number | string;
  totalAmount: number;
  shippingAmount: number;
  items: { productId?: number; id?: number; productName: string; subtotal: number; quantity: number }[];
}) {
  if (typeof window === "undefined" || typeof gtag === "undefined") return;
  gtag("event", "purchase", {
    transaction_id: String(order.id),
    currency: "ZAR",
    value: order.totalAmount,
    shipping: order.shippingAmount,
    items: order.items.map((i) => ({
      item_id: String(i.productId ?? i.id ?? ""),
      item_name: i.productName,
      price: i.quantity > 0 ? i.subtotal / i.quantity : i.subtotal,
      quantity: i.quantity,
    })),
  });
}
