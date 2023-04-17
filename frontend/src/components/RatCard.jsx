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
  
  export const RatCard = () => {
  
      let name = "RAT 7: sequence diagrams"
      let question = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, nam."
  
    return (
      <Card>
        <CardHeader>
          <Heading size="md">{name}</Heading>
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
        <Button colorScheme='blue'>Submit</Button>
        <Button colorScheme='orange'>Quit</Button>

            </HStack>
        </CardFooter>
      </Card>
    );
  };
  