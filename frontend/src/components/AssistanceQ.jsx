import {
    Card,
    Heading,
    VStack,
    HStack,
    IconButton,
    Button,
    Text,
    Center
  } from "@chakra-ui/react";
  
  import { CheckIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  import { StatusCard } from "../components/StatusCard";
  
  export const AssistanceQ = () => {

    const [showNext, setShowNext] = useState(false)
    const qLength = 10 // REPLACE   
    
    const startHelp = () => {
      setShowNext(!showNext)
      if (!showNext){
        return
      }
      // publish ready to help 
      // receive name and number?? 

    }
    const finishHelp = () => {
      // PUBLISH help finish
    }

    const helpCard = () => {
      // PUBLISH
      // Info from subscription: who to help
      let name = "ola" // REPLACE
      let group = 2 // REPLACE

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
            <Heading fontSize={"md"}>Next in line:</Heading>
            <Text fontSize={"md"}>{name}</Text>
            <Text fontSize={"md"}>Group number {group}</Text>
            <IconButton
              size={"sm"}
              colorScheme="green"
              icon={<CheckIcon />}
              onClick={finishHelp}
            ></IconButton>
          </VStack>
            </Center>
          </Card>
      )
    }

    return (
      
            <HStack>
              <VStack minW={"50%"} spacing={10}>
                <VStack>

                <Heading>Assistance queue</Heading>
                <Heading
                  color={"gray.600"}
                  size={"sm"}
                  >
                  Queue length: {qLength}
                </Heading>
                  </VStack>
                <Button
                onClick={startHelp}>
                  I want to help
                </Button>
                  {showNext && helpCard()}
              </VStack>
              <VStack minW={"50%"}>
                <Heading>RAT status</Heading>
  
                <StatusCard type={"individual"}></StatusCard>
               <StatusCard type={"team"}></StatusCard>
              </VStack>
            </HStack>
    );
  };
  