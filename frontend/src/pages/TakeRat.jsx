import { Container, Button } from "@chakra-ui/react";
import { RatCard } from "../components/RatCard";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import mqtt from "precompiled-mqtt";

export const TakeRat = () => {
  const navigate = useNavigate()
  const sporsmaal = { // dette er hardkodet JSON, kunne like gjerne vært fra mqtt
    spm1: {
      beskrivelse: "Dette er et test-spørsmål",
      alternativer: [
        {
          alt: "Dette er et test-alternativ",
          korrekt: true,
        },
        {
          alt: "Dette er et test-alternativ",
          korrekt: false,
        },
        {
          alt: "Dette er et test-alternativ",
          korrekt: false,
        },
        {
          alt: "Dette er et test-alternativ",
          korrekt: false,
        },
      ],
    },
    spm2: {
      beskrivelse: "Dette er et test-spørsmål",
      alternativer: [
        {
          alt: "Dette er et test-alternativ",
          korrekt: true,
        },
        {
          alt: "Dette er et test-alternativ",
          korrekt: false,
        },
        {
          alt: "Dette er et test-alternativ",
          korrekt: false,
        },
        {
          alt: "Dette er et test-alternativ",
          korrekt: false,
        },
      ],
    },
  }; // dette er hardkodet JSON, kunne like gjerne vært fra mqtt

  const [client, setClient] = useState(null);
  /*const [isSubed, setIsSub] = useState(false);*/
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [data, setData] = useState({}); //data fra RAT

  const connect = () => {
    //const url = `ws://broker.emqx.io:8083/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,
    };

    //options.username = localStorage.getItem("User");
    options.username = "komsys";
    options.password = "komsys123";
    console.log(options);

    setClient(mqtt.connect("ws://broker.emqx.io:8083/mqtt")); //#DENNE FUNKER I DET MINSTE
    //setClient(mqtt.connect("ws://mqtt-broker.tandberg.org:9001"), options) //# DENNE FUNKER IKKE (muligens noe funky med connection)
  };




    const publish = () => {
      if (!client) {
        console.log("no client");
        return;
      }
      console.log("publishing");

      client.publish("takerat", JSON.stringify(data), 1, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        } else {
          navigate("/waitingroom")
        }
      });
      client.publish("takerat", "yes", 1, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    };



  useEffect(() => {
    console.log(JSON.stringify(data));
    publish();
  }, [data]);

  useEffect(() => {
      if (client) {
      console.log(client)
      console.log("connected")
      client.on("connect", () => {
        console.log("connected")
        //publish();
        setConnectStatus("Connected");
        
        
      });
      client.on("message", (topic, message) => {
        setPayload({ topic, message: message.toString() });
      });
    };
    connect();
    
    console.log(connectStatus)
  

  /*Connection*/ 
  /*const { host, clientId, port, username, password } = values;*/

    
  },[]);
  return (
    <Container marginTop={10}>

      <RatCard
        ratType={"Individual"}
        sporsmaal={sporsmaal}
        setData={setData}
      ></RatCard>
    </Container>
  );
};
