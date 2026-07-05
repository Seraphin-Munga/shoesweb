"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

export interface OrderNotification {
  orderId: number;
  customerName: string;
  customerEmail: string;
  totalAmountZar: number;
  totalFormatted: string;
  itemCount: number;
  shippingCountry: string;
  createdAt: string;
  items: { productName: string; quantity: number; priceFormatted: string }[];
}

// Strip the trailing /api segment — the hub lives at the root, not under /api
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api")
  .replace(/\/api\/?$/, "");
const HUB_URL = `${API_BASE}/hubs/orders`;

export function useOrderNotifications() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [connected, setConnected]         = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const clearNotifications = useCallback(() => setNotifications([]), []);
  const dismissOne = useCallback((orderId: number) =>
    setNotifications((prev) => prev.filter((n) => n.orderId !== orderId)), []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets |
                   signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.None)
      .build();

    connectionRef.current = connection;

    connection.on("ReceiveOrderNotification", (notification: OrderNotification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Play a subtle sound (browser only)
      if (typeof window !== "undefined") {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.4);
        } catch {}
      }
    });

    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(async () => {
      setConnected(true);
      await connection.invoke("JoinAdminGroup").catch(() => {});
    });
    connection.onclose(() => setConnected(false));

    connection
      .start()
      .then(async () => {
        setConnected(true);
        await connection.invoke("JoinAdminGroup").catch(() => {});
      })
      .catch(() => setConnected(false));

    return () => {
      connection.stop();
    };
  }, []);

  return {
    notifications,
    unreadCount: notifications.length,
    connected,
    clearNotifications,
    dismissOne,
  };
}
