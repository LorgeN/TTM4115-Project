
import { Container, Button } from "@chakra-ui/react";
import { RatCard } from "../components/RatCard";
import { useEffect, useState } from "react";
import mqtt from "precompiled-mqtt";



export const TakeRat = () => {




  const [client, setClient] = useState(null);
  /*const [isSubed, setIsSub] = useState(false);*/
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");

  const connect = () => {

    //const url = `ws://broker.emqx.io:8083/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false
    };
    
    //options.username = localStorage.getItem("User");
    options.username = "komsys";
    options.password = "komsys123";
   console.log(options)

  
    setClient(mqtt.connect("ws://broker.emqx.io:8083/mqtt")); //#DENNE FUNKER I DET MINSTE
    //setClient(mqtt.connect("ws://mqtt-broker.tandberg.org:9001"), options) //# DENNE FUNKER IKKE (muligens noe funky med connection)

  }

  const publish = () => {
    client.publish("takerat", 'hei', 1, error => {
      if (error) {
        console.log('Publish error: ', error);
      }
    
    });

  }
  
  useEffect(() => {
    const connection = new Promise((resolve, reject) => {
      connect();
      resolve();
      reject();
    }).then(
      if (client) {
      console.log(client)
      console.log("connected")
      client.on("connect", () => {
        console.log("connected")
        publish();
        setConnectStatus("Connected");
        
        
      });
      client.on("message", (topic, message) => {
        setPayload({ topic, message: message.toString() });
      });
    });
    connect();
    
    console.log(connectStatus)
  

  /*Connection*/ 
  /*const { host, clientId, port, username, password } = values;*/

    
  },[]);
  return (
    <Container marginTop={10}>
        
        <Button onClick={publish} colorScheme={"blue"}>test</Button>
        <RatCard ratType={"Individual"}></RatCard>
        
    </Container>
  );
};
