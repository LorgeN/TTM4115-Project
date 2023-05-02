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
import { CLIENT } from "../utils/client";

export const StudentHome = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    CLIENT.subscribe("ttm4115project/sessions/outbound", 0);

    const listener = (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);
      
      if (res.event === "session_created") {
        CLIENT.unsubscribe("ttm4115project/sessions/outbound");

        localStorage.setItem("inbound", res.data.topic_inbound);
        const outbound = res.data.topic_outbound;
        localStorage.setItem("outbound", outbound);
        CLIENT.subscribe(outbound, "0");
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, []);

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
      CLIENT.publish(
        "ttm4115project/sessions/inbound",
        JSON.stringify(authData),
        0
      );
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  const startRat = () => {
    navigate("/takeirat");
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
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
