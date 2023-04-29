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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const StudentHome = () => {
  const [isHelpRequested, setHelpRequested] = useState(false);
  const navigate = useNavigate();
  const qNum = 10;

  const onRequestHelp = () => {
    setHelpRequested(!isHelpRequested);
    if (isHelpRequested) {
      //TODO: send request
    }
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
