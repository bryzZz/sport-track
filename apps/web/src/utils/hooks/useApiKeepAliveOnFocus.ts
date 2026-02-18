import { useEffect, useRef } from "react";

import { api } from "api/api";

type UseApiKeepAliveOnFocusOptions = {
  enabled?: boolean;
  intervalMs?: number;
};

const DEFAULT_KEEP_ALIVE_INTERVAL_MS = 5 * 60 * 1000;

export const useApiKeepAliveOnFocus = ({
  enabled = true,
  intervalMs = DEFAULT_KEEP_ALIVE_INTERVAL_MS,
}: UseApiKeepAliveOnFocusOptions = {}) => {
  const lastPingAtRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePing = () => {
      const currentTimestamp = Date.now();

      if (currentTimestamp - lastPingAtRef.current < intervalMs) {
        return;
      }

      lastPingAtRef.current = currentTimestamp;

      void api.get("/health").catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      handlePing();
    };

    window.addEventListener("focus", handlePing);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handlePing);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, intervalMs]);
};
