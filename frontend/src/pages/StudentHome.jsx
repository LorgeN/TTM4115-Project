import {
  Button,
  Card,
  VStack,
  Container,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Box,
  // CloseButton
} from "@chakra-ui/react";
import {useState} from "react"
import { useNavigate } from "react-router-dom";


export const StudentHome = () => {


  const [isHelpRequested, setHelpRequested] = useState(false);
  const navigate = useNavigate();


  const onRequestHelp = () => {
    setHelpRequested(!isHelpRequested)
    if(isHelpRequested){
      //TODO: send request
    }
  }

  const startRat = () => {
    // get the RAT 
    navigate("/takerat")
  }

  return (
    <Container
      maxW={"4xl"}
      marginTop={"50"}
      
    >
      {/* TODO: center vertically */}
      <Card >
        <CardHeader>
          <Heading size="md"> Welcome Back!</Heading>
        </CardHeader>
        <CardBody>
          <VStack
            py={10}

          >
            <Button onClick={startRat} colorScheme={"blue"}>Take RAT</Button>
            {/* no need to input reason */} 
            <Button onClick={onRequestHelp} colorScheme={"teal"}>Request help</Button>
            {isHelpRequested&&(
              <Box marginTop={10} textAlign={"center"} p={4} background={"green.100"} rounded={"2xl"}>
                <Text>In queue</Text>
                {/* <CloseButton size='sm' /> */}
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
