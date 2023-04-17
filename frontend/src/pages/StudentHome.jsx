import {
  Button,
  Card,
  VStack,
  Container,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Box
} from "@chakra-ui/react";
import {useState} from "react"

export const StudentHome = () => {

  const dummyQnum = 4

  const [isHelpRequested, setHelpRequested] = useState(false);

  const onRequestHelp = () => {
    setHelpRequested(!isHelpRequested)
    if(isHelpRequested){
      //TODO: send request
    }
  }

  return (
    <Container
      maxW={"4xl"}
      bg={""}
    >
      {/* TODO: center vertically */}
      <Card variant={"outline"}>
        <CardHeader>
          <Heading size="md"> Welcome Back!</Heading>
        </CardHeader>
        <CardBody>
          <VStack
            py={10}

          >
            <Button>Take RAT</Button>
            {/* no need to input reason */} 
            <Button onClick={onRequestHelp}>Request help</Button>
            {isHelpRequested&&(
              <Box marginTop={10} textAlign={"center"} p={4} background={"green.100"} rounded={"2xl"}>
                <Text>Your place in the queue is:</Text>
                <Text >{dummyQnum}</Text>

              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
