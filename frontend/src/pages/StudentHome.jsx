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
import { useNavigate } from "react-router-dom";
import { createClient } from "../utils/client";

export const StudentHome = () => {
  const navigate = useNavigate();
  const [isHelpRequested, setHelpRequested] = useState(false);
  const [qNum, setqNum] = useState(0);
  const [client] = useState(createClient());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    client.on("message", (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);

      if (res.event === "queue_update") {
        setqNum(res.data.position);
      } else if (res.event === "session_created") {
        localStorage.setItem(
          "inbound",
          "ttm4115project/" + res.data.topic_inbound
        );
        const outbound = "ttm4115project/" + res.data.topic_outbound;
        localStorage.setItem("outbound", outbound);
        client.subscribe(outbound, "0");
      }
    });

    client.on("connect", () => {
      console.log("connect");
      client.subscribe("ttm4115project/sessions/outbound", 0);
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]); /*  connection useEffect */

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      const authData = {
        event: "auth",
        data: {
          scope: "student",
          group: localStorage.getItem("TeamNumber"),
          id: localStorage.getItem("User"),
        },
      };
      console.log(authData);
      client.publish(
        "ttm4115project/sessions/inbound",
        JSON.stringify(authData),
        0
      );
      setIsAuthenticated(true);
    }
  }, [client, isAuthenticated]);

  const onRequestHelp = () => {
    if (isHelpRequested) {
      console.log("Help already requested");
      return;
    }

    const helpData = {
      event: "request_help",
      data: {
        student: localStorage.getItem("User"),
        team: localStorage.getItem("TeamNumber"),
      },
    };
    console.log("help");
    client.publish(localStorage.getItem("inbound"), JSON.stringify(helpData));
    setHelpRequested(true);
  };

  const startRat = () => {
    // get the RAT
    navigate("/takerat");
  };

  return (
    <Container maxW={"4xl"} marginTop={"50"}>
      <Card>
        <CardHeader>
          <Heading size="md">
            {" "}
            Welcome Back, {localStorage.getItem("User")}!
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack py={10} spacing={10}>
            <Button onClick={startRat} colorScheme={"blue"}>
              Take RAT
            </Button>
            {/* no need to input reason */}
            <Button onClick={onRequestHelp} colorScheme={"teal"}>
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
                  <Heading color={"gray.700"} size={"md"}>
                    {" "}
                    You are number
                  </Heading>
                  <Heading color={"orange"}> {qNum}</Heading>
                  <Heading color={"gray.700"} size={"md"}>
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
