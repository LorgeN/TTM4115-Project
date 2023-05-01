import { Container, Button } from "@chakra-ui/react";
import { RatCard } from "../components/IRatCard";
import { useEffect, useState, useCallback } from "react";
import { json, useNavigate } from "react-router-dom";
import mqtt from "precompiled-mqtt";

export const TakeRat = () => {
  const navigate = useNavigate()
  /*const sporsmaal = {
    "questions": [
      {
        "question": "This is a question",
        "answers": [
          "This is answer 1",
          "This is answer 2",
          "This is answer 3",
          "This is answer 4 (CORRECT)"
        ],
        "correct_answer": 3
      },
      {
        "question": "This is a question",
        "answers": [
          "This is answer 1",
          "This is answer 2",
          "This is answer 3",
          "This is answer 4 (CORRECT)"
        ],
        "correct_answer": 3
      }
    ]
  }; */// dette er hardkodet JSON, kunne like gjerne vært fra mqtt

  const [client, setClient] = useState(null);
  /*const [isSubed, setIsSub] = useState(false);*/
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [data, setData] = useState({}); //data fra RAT
  const [sporsmaal, setSporsmaal] = useState({});
  const connect = () => {
    if (!client){
      const options = {
        clientId: 'clientId-' + Math.random().toString(16).substr(2, 8),
        username: "komsys",
        password: "komsys123"
      }
      console.log("trying to connect")
      setClient(mqtt.connect("wss://mqtt-broker.tanberg.org:9001/mqtt", options));
    } //#DENNE FUNKER I DET MINSTE
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
        client.subscribe("ttm4115project/student/08/test1/outbound")
        
        
      });


      client.on("message", (topic, message) => {
        console.log(message)
        console.log(JSON.parse(message).data)
        if (JSON.parse(message).event === "questions") {
          setSporsmaal(JSON.parse(message.data))
        }
        setPayload({ topic, message: message.toString() });
      });
    };
    connect();
    
    console.log(connectStatus)
  

  /*Connection*/ 
  /*const { host, clientId, port, username, password } = values;*/

    
  },[client]);
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
