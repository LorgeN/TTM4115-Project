import React, { useState, useEffect } from "react";
import { CLIENT } from "./client";

const useEvent = (event) => {
  const [eventData, setEventData] = useState(undefined);

  useEffect(() => {
    const listener = (topic, message) => {
      const res = JSON.parse(message);

      if (res.event === event) {
        setEventData(res.data);
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, [event]);

  const publishEvent = (value) => {
    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({
        event: event,
        data: value,
      })
    );
  };

  return eventData, publishEvent;
};
