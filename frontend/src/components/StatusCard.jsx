import {
    Card,
    Heading,
    VStack,
    Center,
  } from "@chakra-ui/react";
import { useEffect, useState } from "react";

  
  export const StatusCard = (props) => {

    const [title, setTitle] = useState("")
    const [footer, setFooter] = useState("")
    const [completed, setCompleted] = useState(0)
    const [total, setTotal] = useState(0)
    const [topic, setTopic] = useState("") // Topic to subscribe to 


    useEffect(() => {
        if (props.type === "individual"){
            setTitle("Individual")
            setFooter("Students")
            setTopic("individual") // replace
            setTotal(42) // replace
            setCompleted(13) // Replace
        }
        else {
            setTitle("Team")
            setFooter("Teams")
            setTopic("Team") //Replace
            setTotal(16) // Replace
            setCompleted(4) // Replace
        }
     },[completed]); 

  
    return (
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
        {title} RAT
      </Heading>
        <Heading
        color={"green"}
        size={"md"}
        >
        {/* TODO Replace */}
        {completed}/{total} 
      </Heading>
        <Heading
        color={"gray.600"}
        size={"sm"}
        >
        {footer} have completed
      </Heading>
          </VStack>


        </Center>
      </Card>
    );
  };
  