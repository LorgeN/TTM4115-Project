import {
  Card,
  CardHeader,
  CardBody,
  Container,
  CardFooter,
  useDisclosure,
  Button,
  Center,
} from "@chakra-ui/react";
import { AssistanceQ } from "../components/AssistanceQ";
import { AddRatModal } from "../components/AddRatModal";
import { useState, useEffect } from "react";
import { createClient } from "../utils/client";

export const TaHome = () => {
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [client] = useState(createClient());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [helpRequest, setHelpRequest] = useState();
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    client.on("message", (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);

      if (res.event === "facilitator_session_created") {
        localStorage.setItem(
          "inbound",
          "ttm4115project/" + res.data.topic_inbound
        );
        const outbound = "ttm4115project/" + res.data.topic_outbound;
        localStorage.setItem("outbound", outbound);
        client.subscribe(outbound, "0");
      } else if (res.event === "request_accepted") {
        setHelpRequest(res.data);
      } else if (res.event === "num_requests") {
        setQueueLength(res.data);
      }
    });

    client.on("connect", () => {
      console.log("connect");
      client.subscribe("ttm4115project/sessions/outbound", 0);
    });
  }, [client]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      const authData = {
        event: "auth",
        data: {
          scope: "facilitator",
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

  return (
    <Container maxW={"4xl"} marginTop={"50"}>
      <Card>
        <CardHeader></CardHeader>
        <CardBody paddingBottom={20}>
          <AssistanceQ client={client} helpRequest={helpRequest} setHelpRequest={setHelpRequest} queueLength={queueLength}></AssistanceQ>
        </CardBody>
        <Center paddingBottom={10}>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"orange"}
            bg={"orange.400"}
            _hover={{ bg: "orange.500" }}
            onClick={() => onAddOpen()}
          >
            Create new RAT
          </Button>
          <AddRatModal
            isOpen={isAddOpen}
            onOpen={onAddOpen}
            onClose={onAddClose}
          ></AddRatModal>
        </Center>
      </Card>
    </Container>
  );
};
