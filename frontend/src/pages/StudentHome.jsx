import {
  Button,
  Card,
  VStack,
  Container,
  CardHeader,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import mqtt from "precompiled-mqtt";

export const StudentHome = () => {
  const [isHelpRequested, setHelpRequested] = useState(false);
  const navigate = useNavigate();
  const [qNum, setqNum] = useState(0);
  const [client, setClient] = useState(null);
  const [isSubed, setIsSub] = useState(false);

  const [connectStatus, setConnectStatus] = useState("Connect");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (!client){
      const options = {
        clientId: 'clientId-' + Math.random().toString(16).substr(2, 8),
        username: "komsys",
        password: "komsys123"
      }
      console.log("trying to connect")
      setClient(mqtt.connect("wss://mqtt-broker.tanberg.org:9001/mqtt", options));
    }
    if (client) {
      client.on('connect', () => {
        console.log("connect")
        if (!isAuthenticated){
          const authData = {
            "event": "auth",
            "data": {
              "scope": "student",
              "group": localStorage.getItem("TeamNumber"),
              "id": localStorage.getItem("User")
            }
          }
          client.publish("ttm4115project/sessions/inbound", JSON.stringify(authData), 0)
          client.subscribe("ttm4115project/sessions/outbound", "0")
        }
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
        //console.log(JSON.parse(message))
        console.log(JSON.parse(message).event);
        if (JSON.parse(message).event === 'queue_update') {
          setqNum(JSON.parse(message).data.position)

     
           

        
        }


        
      });
    }
  }, [client]); /*  connection useEffect */
  const onRequestHelp = () => {
    /*console.log(JSON.parse(JSON.stringify({
      "event": "queue_update",
      "data": {
        "position": "1",
      },
    }))) */  //pOSITION EXAMPLE JSON
  
    
    

    
    if (isHelpRequested) {
      return console.log("Help already requested")
      
    }
    const helpData = {
      "event": "request_help",
      "data": {
        "student": localStorage.getItem("User"),
        "team": localStorage.getItem("TeamNumber")
      }
    }
    console.log("help")
    client.publish("ttm4115project/sessions/inbound", JSON.stringify(helpData))
    setHelpRequested(!isHelpRequested);
    //TODO: send request
  };

  const startRat = () => {
    // get the RAT
    navigate("/takerat");
  };

  return (
    <Container
      maxW={"4xl"}
      marginTop={"50"}
    >
      <Card>
        <CardHeader>
          <Heading size="md">
            {" "}
            Welcome Back, {localStorage.getItem("User")}!
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack
            py={10}
            spacing={10}
          >
            <Button
              onClick={startRat}
              colorScheme={"blue"}
            >
              Take RAT
            </Button>
            {/* no need to input reason */}
            <Button
              onClick={onRequestHelp}
              colorScheme={"teal"}
            >
              Request help
            </Button>
            {isHelpRequested && (
              <Card
                backgroundColor={"orange.50"}
                p={10}
                variant={"elevated"}
                shadow={"xl"}
              >
                <Stack align={"center"}>
                  <Heading
                    color={"gray.700"}
                    size={"md"}
                  >
                    {" "}
                    You are number
                  </Heading>
                  <Heading color={"orange"}> {qNum}</Heading>
                  <Heading
                    color={"gray.700"}
                    size={"md"}
                  >
                    {" "}
                    in line
                  </Heading>
                </Stack>
              </Card>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
