import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import { BASE_URL } from "~/settings/constants";
import { useExceptions } from "./useExceptions";

export default function useWebSocket(url, token) {
  const ref = useRef(null);
  const { handleException } = useExceptions();
  const [connectionStatus, setConnectionStatus] = useState(false);

  const handleEmitSocket = (type, data, fieldKey = null) => {
    if (!ref.current) return true;
    ref.current.emit(type, data, async (err) => {
      if (fieldKey && !!err) {
        const { fetchData } = await handleException(err);
        fieldKey.form.setFields([
          {
            name: fieldKey.name,
            errors: [fetchData?.message],
          },
        ]);
      }
      if (!!err) {
        await handleException(err);
      }
    });
  };

  const handleListenData = useCallback(
    (type) => {
      if (!ref.current) return true;
      return ref.current.on(type, ({ data }) => {
        return data;
      });
    },
    [ref]
  );

  useEffect(() => {
    const socket = token
      ? io(`${BASE_URL}${url}`, token)
      : io(`${BASE_URL}${url}`);
    if (socket?.active) {
      setConnectionStatus(true);
    }
    ref.current = socket;

    return () => socket.disconnect();
  }, [url, token]);

  return { handleEmitSocket, handleListenData, connectionStatus };
}
