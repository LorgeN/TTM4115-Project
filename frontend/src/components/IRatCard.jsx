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
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
// import {RatTimer} from "./RatTimer"
import { CountdownTimer } from "./RatTimer.jsx";

export const RatCard = (props) => {
  const { register, handleSubmit, errors, reset, control } = useForm();
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
   if (isTimerExpired){
    // console.log("EXPIRED")
    // handleSubmit()
    // FINN EN MÅTE Å SUBMITTE FORMEN 
    navigate("/waitingroom")
   }
 },[isTimerExpired]); 

  // TODO: replace dummydata
  let name = "RAT 7: sequence diagrams";
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // TODO: save answers
    console.log("kommer inn her")
    props.setData(data);
    console.log(data); //DATA FRA RAT
  };

  const quit = () => {
    // TODO: save progredd
    navigate("/studenthome");
  };

  /*mosquitto_pub -h mqtt-broker.tanberg.org -u komsys -P komsys123 -t ttm4115project/sessions/outbound -m '{
    "event":"questions",
                "data":
                  {
                    "questions": [
                      {
                        "question": "This is a question",
                        "answers": [
                          "This is answer 1",
                          "This is answer 2",
                          "This is answer 3",
                          "This is answer 4 (CORRECT)"
                        ],
                        "correct_answer": 3
                      },
                      {
                        "question": "This is a question",
                        "answers": [
                          "This is answer 1",
                          "This is answer 2",
                          "This is answer 3",
                          "This is answer 4 (CORRECT)"
                        ],
                        "correct_answer": 3
                      }
                    ]
                  }
  }'
  */

  

  const getTime = () => { // Replace with getting actual time. submit on expire 
    const time = new Date();
    return time.setSeconds(time.getSeconds() + 1200);
  }
  console.log(props.sporsmaal)
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{name}</Heading>
        <Text>{props.ratType} RAT</Text>
        <CountdownTimer targetDate={getTime()} setIsTimerExpired={setIsTimerExpired}></CountdownTimer>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        {props.sporsmaal.length >1 && Object.keys(props.sporsmaal["questions"]).map((i) => {
          console.log(props.sporsmaal["questions"][i].answers[2]);
          return (
            <CardBody>
              <Stack
                divider={<StackDivider />}
                spacing="4"
              >
                {/* Questions, for each:  */}
                <Box>
                  <Text>{props.sporsmaal["questions"][i].question}</Text>

                  {/* Answers: for alternative in question: radiobutton + text  */}

                  <RadioGroup>
                    <Stack py={2}>
                      {props.sporsmaal["questions"][i].answers.map((alt,j) => (
                        
                        <Radio
                          {...register(i)}
                          value={j.toString()}
                          key={j}
                          onClick={()=>setSelected(j)}
                        >
                          {alt}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>
              </Stack>
            </CardBody>
          );
        })}
        <CardFooter>
          <Stack
            direction={"row"}
            spacing={2}
          >
            <Button
              type="submit"
              colorScheme="blue"
            >
              Test
            </Button>
            <Button
              onClick={quit}
              colorScheme="orange"
            >
              Quit
            </Button>
          </Stack>
        </CardFooter>
      </form>
    </Card>
  );
};
