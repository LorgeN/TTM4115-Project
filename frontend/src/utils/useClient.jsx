import mqtt from "precompiled-mqtt";
import { useSession } from "./useSession";
import { React, useState, useEffect } from "react";

const SESSION_MANAGER_TOPIC_IN = "ttm4115project/sessions/inbound";
const SESSION_MANAGER_TOPIC_OUT = "ttm4115project/sessions/outbound";

export const createClient = () => {
  const options = {
    clientId: "clientId-" + Math.random().toString(16).substring(2, 10),
    username: "komsys",
    password: "komsys123",
  };

  const client = mqtt.connect(
    "wss://mqtt-broker.tanberg.org:9001/mqtt",
    options
  );

  client.on("error", (err) => {
    console.error("Connection error: ", err);
    client.end();
  });

  client.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  client.setMaxListeners(0); // Disable max listeners on client (default is 10)

  return client;
};

export const CLIENT = createClient();

export const useAuth = () => {
  const {
    setInboundTopic,
    setOutboundTopic,
    client,
    authenticated,
    setAuthenticated,
    scope,
    team,
    name,
  } = useSession();

  useEffect(() => {
    const listener = (topic, message) => {
      const res = JSON.parse(message);

      if (res.event === "session_created") {
        client.unsubscribe(SESSION_MANAGER_TOPIC_OUT);

        setInboundTopic(res.data.topic_inbound);
        setOutboundTopic(res.data.topic_outbound);
      }
    };

    client.on("message", listener);
    console.log("Subscribed to", SESSION_MANAGER_TOPIC_OUT);

    return () => {
      console.log("Unsubscribed from", SESSION_MANAGER_TOPIC_OUT);
      client.removeListener("message", listener);
    };
  }, [client]);

  useEffect(() => {
    if (!authenticated) {
      const authData = {
        event: "auth",
        data: {
          scope: scope,
          group: team,
          id: name,
        },
      };

      client.subscribe(SESSION_MANAGER_TOPIC_OUT, 0);
      client.publish(SESSION_MANAGER_TOPIC_IN, JSON.stringify(authData), {
        qos: 2,
      });
      setAuthenticated(true);
    }
  }, [authenticated, setAuthenticated]); // Run only once
};

export const useClient = () => {
  const { inboundTopic, client } = useSession();

  const publish = (data, callback = undefined) => {
    client.publish(inboundTopic, JSON.stringify(data), { qos: 2 }, (error) => {
      if (error) {
        console.log("Publish error:", error);
      } else {
        if (callback) {
          callback();
        }
      }
    });
  };

  return { client, publish };
};
