import {
    Radio,
    Card,
    CardHeader,
    Heading,
    Stack,
    CardBody,
    Box,
    Text,
    StackDivider,
    CardFooter,
    Button,
    HStack
  } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";

  
  export const RatCard = (props) => {
  
    // TODO: replace dummydata 
      let name = "RAT 7: sequence diagrams"
      let question = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, nam."
      const navigate = useNavigate();



      const submit = () => {
        // TODO: save answers
        navigate("/waitingroom");
      }

      const quit = () => {
        // TODO: save progredd
        navigate("/studenthome");

      }
  
    return (
      <Card>
        <CardHeader>
          <Heading size="md">{name}</Heading>
          <Text >{props.ratType} RAT</Text>
        </CardHeader>
  
        <CardBody>
          <Stack
            divider={<StackDivider />}
            spacing="4"
          >
              {/* Questions, for each:  */}
            <Box>
              <Text
                pt="2"
                fontSize="sm"
              >
                {question}
              </Text>
  
              {/* Answers: for alternative in question: radiobutton + text  */}
  
              <Stack py={2}>
                <Radio value="1">Radio 1</Radio>
                <Radio value="2">Radio 2</Radio>
                <Radio value="3">Radio 3</Radio>
                <Radio value="3">Radio 3</Radio>
              </Stack>
            </Box>
          </Stack>
        </CardBody>
        <CardFooter >
            <HStack >
        <Button onClick={submit} colorScheme='blue'>Submit</Button>
        <Button onClick={quit} colorScheme='orange'>Quit</Button>

            </HStack>
        </CardFooter>
      </Card>
    );
  };
  