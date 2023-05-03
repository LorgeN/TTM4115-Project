import React, { useState, useEffect } from "react";
import { useClient } from "./useClient";

const useEvent = (event) => {
  const [eventData, setEventData] = useState(undefined);
  const { client, publish } = useClient();

  useEffect(() => {
    if (!client) {
      return;
    }

    const listener = (topic, message) => {
      const res = JSON.parse(message);

      if (res.event === event) {
        setEventData(res.data ?? {}); // Make sure its not undefined if we have received the event
      }
    };

    client.on("message", listener);

    return () => {
      client.removeListener("message", listener);
    };
  }, [client, event]);

  const publishEvent = (value) => {
    publish({
      event: event,
      data: value,
    });
  };

  const clearEvent = () => {
    setEventData(undefined);
  };

  return { eventData, publishEvent, clearEvent };
};

export default useEvent;
