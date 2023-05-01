import { Button, Card, Container, Heading, Stack } from "@chakra-ui/react";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import mqtt from "precompiled-mqtt";

export const WaitingRoom = () => {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate()
  const [client, setClient] = useState(null);
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [isSubed, setIsSub] = useState(false);

/* useEffect for å sette opp connection */
  useEffect(() => {
    if (!client){
      setClient(mqtt.connect("ws://broker.emqx.io:8083/mqtt"));
    }
    if (client) {
      client.on('connect', () => {
        
        client.subscribe("takerattma4115", "0", (error) => {
          if (error) {
            console.log('Subscribe to topics error', error)
            return
          }
          setIsSub(true)
        });
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        if (topic === 'takerattma4115') {
          if (JSON.parse(message.toString())["msg"] === 'true') { // Hvis topic er "takerattma4115" og meldingen er "msg: true", så er TRAT ready
            setIsReady(true);
          }
        }
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]); /*  connection useEffect */

  const startTRat = () => {
    navigate("/takeTRat")
  } 

  return (
    <Container maxW={"5xl"} variant={"elevated"} marginTop={10} p={10}>
        <Card p={10}>

        <Stack alignItems={"center"}>

      <Heading>Waiting to start Team RAT </Heading>
      <Button 
          isDisabled={!isReady}
          colorScheme={"green"}
          onClick={startTRat}

          >
          Start
        </Button>
            </Stack>

              </Card>

      
    </Container>
  );
};
