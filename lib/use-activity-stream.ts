"use client";

import { useEffect, useRef, useState } from "react";

export type ActivityEventDTO = {
  id: string;
  engagementId: string;
  type: string;
  payload: unknown;
  createdAt: string;
};

export function useActivityStream(engagementId: string) {
  const [events, setEvents] = useState<ActivityEventDTO[]>([]);
  const [connected, setConnected] = useState(false);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!engagementId) return;
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    function open() {
      if (stopped) return;
      es = new EventSource(`/api/engagements/${engagementId}/activity`);
      es.addEventListener("connected", () => {
        setConnected(true);
        retryRef.current = 0;
      });
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as ActivityEventDTO;
          setEvents((prev) => [data, ...prev].slice(0, 50));
        } catch {
          // skip malformed
        }
      };
      es.onerror = () => {
        setConnected(false);
        es?.close();
        const delay = Math.min(48_000, 3000 * Math.pow(2, retryRef.current));
        retryRef.current += 1;
        reconnectTimer = setTimeout(open, delay);
      };
    }

    open();
    return () => {
      stopped = true;
      es?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [engagementId]);

  return { events, connected };
}
