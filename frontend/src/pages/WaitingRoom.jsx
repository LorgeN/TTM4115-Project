import { Button, Card, Container, Heading, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const WaitingRoom = () => {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate()

  const startTRat = () => {
    navigate("/takeTRat")
  } 

  return (
    <Container maxW={"5xl"} variant={"elevated"} marginTop={10} p={10}>
        <Card p={10}>

        <Stack alignItems={"center"}>

      <Heading>Waiting to start Team RAT </Heading>
      <Button 
          // isDisabled={!isReady}
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
