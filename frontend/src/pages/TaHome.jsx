import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Container,
  VStack,
  HStack,
  IconButton,
  Box,
  Center,
} from "@chakra-ui/react";

import { CheckIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const TaHome = () => {
  // TODO: publish and subscribe
  // TODO: seperate Q cards as own component
  // TODO: seperate status cards as own component

  const [dummyQ, setDummyQ] = useState([2, 5, 7, 1, 8, 7, 6]);

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

              {dummyQ.map((group, i) => getCard(i, group))}
            </VStack>
            <VStack minW={"50%"}>
              <Heading>RAT status</Heading>

              <Card
                shadow={"lg"}
                backgroundColor={"gray.50"}
                p={7}
                minW={"60%"}
              >
                <Center>
                    <VStack spacing={5}>

                <Heading
                size={"md"}
                >
                Individual RAT
              </Heading>
                <Heading
                color={"green"}
                size={"md"}
                >
                {/* TODO Replace */}
                7/42 
              </Heading>
                <Heading
                color={"gray.600"}
                size={"sm"}
                >
                Students have completed
              </Heading>
                  </VStack>


                </Center>
              </Card>
              <Card
                shadow={"lg"}
                backgroundColor={"gray.50"}
                p={7}
                minW={"60%"}

              >
                <Center>
                    <VStack spacing={5}>

                <Heading
                size={"md"}
                >
                Team RAT
              </Heading>
                <Heading
                color={"green"}
                size={"md"}
                >
                {/* TODO Replace */}
                3/16 
              </Heading>
                <Heading
                color={"gray.600"}
                size={"sm"}
                >
                Teams have completed
              </Heading>
                  </VStack>


                </Center>
              </Card>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    </Container>
  );
};
