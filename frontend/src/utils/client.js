import mqtt from "precompiled-mqtt";

export const CLIENT = createClient();

export function createClient() {
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

  return client;
}
