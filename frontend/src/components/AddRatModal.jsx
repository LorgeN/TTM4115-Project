import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Stack,
  FormControl,
  Text,
  Container,
  Heading,
  Card,
  HStack,
  Checkbox,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

export const AddRatModal = (props) => {
  const [title, setTitle] = useState("");
  const [q, setQuestion] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [a4, setA4] = useState("");
  const [a1Correct, setA1Correct] = useState(true);
  const [a2Correct, setA2Correct] = useState(false);
  const [a3Correct, setA3Correct] = useState(false);
  const [a4Correct, setA4Correct] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(()=>{
    if(!props.isAddOpen){
      resetOptions(true)
      setQuestions([]) // FIX THIS 
    }
  },[props.isAddOpen])


  const checkedChange = (alt) => {
    resetOptions(false)
    switch (alt) {
      case 1:
        setA1Correct(true);
        break;
      case 2:
        setA2Correct(true);
        break;
      case 3:
        setA3Correct(true);
        break;
      case 4:
        setA4Correct(true);
        break;
      default:
        break;
    }
  };

  const addQ = async () => {
    const newQ = {
      numer: questions.length + 1,
      question: q,
      alternatives: [
        {
          alt: a1,
          correct: a1Correct,
        },
        {
          alt: a2,
          correct: a2Correct,
        },
        {
          alt: a3,
          correct: a3Correct,
        },
        {
          alt: a4,
          correct: a4Correct,
        },
      ],
    };
    let cpy = [...questions, newQ]
    setQuestions(cpy)
    resetOptions(true);
  };

  const resetOptions = (includeQ) => {
    setA1Correct(false);
    setA2Correct(false);
    setA3Correct(false);
    setA4Correct(false);
    if (includeQ) {
      setQuestion("");
      setA1("");
      setA2("");
      setA3("");
      setA4("");
    }
  };

  const submitRat = () => {
    // TODO: PUBLISH RAT (from questions[])
  }

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered
        scrollBehavior={"inside"}
        size={"lg"}
      >
        <ModalOverlay
          bg="blackAlpha.400"
          backdropFilter="blur(10px) "
        />
        <ModalContent>
          <ModalHeader>
            <Heading
              fontWeight={500}
              fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
              lineHeight={"110%"}
              color={"gray.700"}
              py={3}
            >
              Create a new RAT
            </Heading>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={7}>
              <Container>
                <Heading
                  fontWeight={500}
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  lineHeight={"110%"}
                  color={"gray.700"}
                >
                  RAT title
                </Heading>
                <Text py={2}>Give the task a descriptive name</Text>
                <FormControl isRequired>
                  <Input
                    placeholder="Title"
                    focusBorderColor="orange.400"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </FormControl>
              </Container>
              <Container>
                <Heading
                  fontWeight={500}
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  lineHeight={"110%"}
                  color={"gray.700"}
                >
                  Add a new question
                </Heading>
                <Text>{questions.length} questions added </Text>
              </Container>
            </Stack>

            <Card
              p={5}
              marginTop={5}
              backgroundColor={"gray.50"}
            >
              <Text py={2}>What is the question?</Text>
              <Input
                placeholder="Question"
                focusBorderColor="orange.400"
                value={q}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <Stack py={3}>
                <Text>Alternatives </Text>
                <HStack>
                  <Input
                    placeholder="Alternative 1"
                    focusBorderColor="orange.400"
                    value={a1}
                    onChange={(event) => setA1(event.target.value)}
                  />
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    isChecked={a1Correct}
                    onChange={() => checkedChange(1)}
                  ></Checkbox>
                </HStack>
                <HStack>
                  <Input
                    placeholder="Alternative 2"
                    focusBorderColor="orange.400"
                    value={a2}
                    onChange={(event) => setA2(event.target.value)}
                  />
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    isChecked={a2Correct}
                    onChange={() => checkedChange(2)}
                  ></Checkbox>
                </HStack>
                <HStack>
                  <Input
                    placeholder="Alternative 3"
                    focusBorderColor="orange.400"
                    value={a3}
                    onChange={(event) => setA3(event.target.value)}
                  />
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    isChecked={a3Correct}
                    onChange={() => checkedChange(3)}
                  ></Checkbox>
                </HStack>
                <HStack>
                  <Input
                    placeholder="Alternative 4"
                    focusBorderColor="orange.400"
                    value={a4}
                    onChange={(event) => setA4(event.target.value)}
                  />
                  <Checkbox
                    size="md"
                    colorScheme="green"
                    onChange={() => checkedChange(4)}
                    isChecked={a4Correct}
                  ></Checkbox>
                </HStack>
              </Stack>
              <Button
                colorScheme="green"
                m={1}
                rounded={"3xl"}
                onClick={addQ}
              >
                OK
              </Button>
            </Card>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="orange"
              m={1}
              rounded={"3xl"}
              onClick={props.onClose} // TODO: replace with function for publishing rat 
            >
              Save
            </Button>

            <Button
              variant="ghost"
              rounded={"3xl"}
              onClick={props.onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
