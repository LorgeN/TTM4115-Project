import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Container,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";

import { CheckIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { StatusCard } from "../components/StatusCard";

export const TaHome = () => {
  // TODO: publish and subscribe
  // TODO: seperate Q cards as own component
  // TODO: seperate status cards as own component

  const [dummyQ, setDummyQ] = useState([2, 5, 7, 1, 8, 7, 6, 4, 13, 23, 21]);

  const helped = () => {
    let cpy = [...dummyQ];
    cpy.shift();
    setDummyQ(cpy);
  };

  function getCard(index, text) {
    return (
      <HStack>
        <Card
          shadow={"lg"}
          minH={15}
          p={5}
          backgroundColor={"gray.50"}
          minW={"25%"}
          display={"flex"}
        >
          <Heading fontSize={"md"}>Group number {text}</Heading>
        </Card>
        {index === 0 ? (
          <IconButton
            size={"sm"}
            colorScheme="green"
            icon={<CheckIcon />}
            onClick={helped}
          ></IconButton>
        ) : null}
      </HStack>
    );
  }

  return (
    <Container
      maxW={"4xl"}
      marginTop={"50"}
    >
      <Card>
        <CardHeader>
          {/* <Heading size="lg">
            Welcome back, TA!
          </Heading> */}
        </CardHeader>
        <CardBody paddingBottom={20}>
          <HStack>
            <VStack minW={"50%"}>
              <Heading>Assistance queue</Heading>
              <Heading
                color={"gray.600"}
                size={"sm"}
              >
                Queue length: {dummyQ.length}
              </Heading>
                <VStack maxH={450} overflow={"scroll"}>
              {dummyQ.map((group, i) => getCard(i, group))}

                </VStack>
            </VStack>
            <VStack minW={"50%"}>
              <Heading>RAT status</Heading>

              <StatusCard type={"individual"}></StatusCard>
             <StatusCard type={"team"}></StatusCard>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    </Container>
  );
};
