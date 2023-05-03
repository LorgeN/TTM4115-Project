import {
  Card,
  Heading,
  VStack,
  HStack,
  IconButton,
  Button,
  Text,
  Center,
} from "@chakra-ui/react";

import { CheckIcon } from "@chakra-ui/icons";
import { StatusCard } from "../components/StatusCard";
import { useClient } from "../utils/useClient";

export const AssistanceQ = ({ helpRequest, clearHelpRequest, queueLength }) => {
  const { publish } = useClient();

  const startHelp = () => {
    if (queueLength > 0) {
      publish({ event: "request_accept" });
    }
  };

  const finishHelp = () => {
    publish({ event: "request_completed" });
    clearHelpRequest();
  };

  const helpCard = () => {
    return (
      <Card
        shadow={"lg"}
        minH={15}
        p={5}
        backgroundColor={"gray.50"}
        minW={"55%"}
        display={"flex"}
      >
        <Center>
          <VStack>
            <Heading fontSize={"md"}>Now helping:</Heading>
            <Text fontSize={"md"}>{helpRequest.student}</Text>
            <Text fontSize={"md"}>Group number {helpRequest.team}</Text>
            <IconButton
              size={"sm"}
              colorScheme="green"
              icon={<CheckIcon />}
              onClick={finishHelp}
            ></IconButton>
          </VStack>
        </Center>
      </Card>
    );
  };

  return (
    <HStack>
      <VStack minW={"50%"} spacing={10}>
        <VStack>
          <Heading>Assistance queue</Heading>
          <Heading color={"gray.600"} size={"sm"}>
            Queue length: {queueLength}
          </Heading>
        </VStack>
        {!helpRequest && queueLength > 0 && (
          <Button onClick={startHelp}>I want to help</Button>
        )}
        {helpRequest && helpCard()}
      </VStack>
      <VStack minW={"50%"}>
        <Heading>RAT status</Heading>

        <StatusCard type={"individual"}></StatusCard>
        <StatusCard type={"team"}></StatusCard>
      </VStack>
    </HStack>
  );
};
