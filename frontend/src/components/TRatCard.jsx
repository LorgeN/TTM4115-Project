import {
  Radio,
  RadioGroup,
  Card,
  CardHeader,
  Heading,
  Stack,
  CardBody,
  Box,
  Text,
  StackDivider,
  Button,
  CardFooter,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const TRatCard = (props) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [nextDisabeled, setNextDisabeled] = useState(true);
  const [checkDisabeled, setCheckDisabeled] = useState(false);
  const [completeDisabeled, setCompleteDisabeled] = useState(true);
  const [selectedAlt, setSelectedAlt] = useState();
  const [showNext, setShowNext] = useState(true);
  const [attempts, setAttempts] = useState([false, false, false, false]);
  const navigate = useNavigate()

  const tmp = [
    {
      numer: 1,
      question: "Hvor mange land er det i verden?",
      alternatives: [
        {
          alt: "17",
          correct: true,
        },
        {
          alt: "999",
          correct: false,
        },
        {
          alt: "69",
          correct: false,
        },
        {
          alt: "136",
          correct: false,
        },
      ],
    },
    {
      numer: 2,
      question: "Hvor lang er nidelva?",
      alternatives: [
        {
          alt: "Dette er et test-alternativ",
          correct: true,
        },
        {
          alt: "Dette er et test-alternativ",
          correct: false,
        },
        {
          alt: "Dette er et test-alternativ",
          correct: false,
        },
        {
          alt: "Dette er et test-alternativ",
          correct: false,
        },
      ],
    },
    {
      numer: 3,
      question: "Hva er riktig alternativ?",
      alternatives: [
        {
          alt: "17",
          correct: true,
        },
        {
          alt: "999",
          correct: false,
        },
        {
          alt: "69",
          correct: false,
        },
        {
          alt: "136",
          correct: false,
        },
      ],
    },
  ];

  // TODO: replace dummydata
  let name = "RAT 7: sequence diagrams";

     useEffect(() => {
        if (selectedAlt){
            setCheckDisabeled(false)
        }
        else {
            setCheckDisabeled(true)
        }
     }, [selectedAlt]);

  const handleNext = () => {  
    setNextDisabeled(true)
    setCheckDisabeled(true)
    setSelectedAlt(undefined)
    setCurrentQ(currentQ + 1);
    setAttempts([false,false,false,false])
    if(currentQ===tmp.length-2){
      setShowNext(false)
      setCompleteDisabeled(true)
      return
    }
  };

  const checkAnswer = () => {
    setNextDisabeled(false);
    let test = tmp[currentQ].alternatives[selectedAlt].correct 
    
    return test;
  };

  const onSubmit = () => {    
    if (!checkAnswer() && selectedAlt) { //TODO fix this 
      let cpy = [...attempts]
      cpy[selectedAlt] = true;
      setAttempts(cpy)
      console.log("attempts: ")
      console.log(attempts)
      setNextDisabeled(true)
      setCompleteDisabeled(true)
      return;
    }
    let data = {
      spm: currentQ,
      ans: selectedAlt,
    };
    props.setData(data);
    console.log(data);
    setCheckDisabeled(true)
    if(currentQ===tmp.length-1){
      setShowNext(false)
      setCompleteDisabeled(false)
      return
    }
  };

  function getRadio(index, text) {
    return (
      <Radio value={index.toString()} key={index} onChange={(event) => newSelect(event.target.value)} isDisabled={attempts[index]}>{text}</Radio>
    );
  }

  const newSelect = (i) => {
    setSelectedAlt(i)
  }

  const complete = () => {
    navigate("/studenthome")
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{name}</Heading>
        <Text fontSize={"lg"}>{props.ratType} RAT</Text>
        <Text fontSize={"sm"} color={"gray.500"}>Question {currentQ+1}/{tmp.length}</Text>
      </CardHeader>
        <CardBody>
          <Stack
            divider={<StackDivider />}
            spacing="4"
          >
            <Box>
              <Text>{tmp[currentQ].question}</Text>
              <RadioGroup
              py={3}
                 onChange={setSelectedAlt}
                 value={selectedAlt}
              >
                <Stack direction="column">
                  {tmp[currentQ].alternatives.map((alternative) => (
                    getRadio(tmp[currentQ].alternatives.indexOf(alternative), alternative.alt)
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          </Stack>
        </CardBody>
        <CardFooter >
          <Stack direction={"row"} spacing={3} > 
        <Button
          onClick={onSubmit}
          colorScheme="blue"
          isDisabled={checkDisabeled}
          >
          Check
        </Button>
        {showNext?(<Button
          onClick={handleNext}
          colorScheme="orange"
          isDisabled={nextDisabeled}
          >
          Next
        </Button>):<Button
          onClick={complete}
          colorScheme="green"
          isDisabled={completeDisabeled}
          >
          Complete RAT
        </Button>
        }
          </Stack>
        </CardFooter>
    </Card>
  );
};
