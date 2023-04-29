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

  useEffect(() => {
   if (isTimerExpired){
    // console.log("EXPIRED")
    // handleSubmit()
    // FINN EN MÅTE Å SUBMITTE FORMEN 
    navigate("/studenthome")
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

  const getTime = () => { // Replace with getting actual time. submit on expire 
    const time = new Date();
    return time.setSeconds(time.getSeconds() + 10);
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{name}</Heading>
        <Text>{props.ratType} RAT</Text>
        <CountdownTimer targetDate={getTime()} setIsTimerExpired={setIsTimerExpired}></CountdownTimer>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(props.sporsmaal).map((key, i) => {
          console.log(key);
          return (
            <CardBody>
              <Stack
                divider={<StackDivider />}
                spacing="4"
              >
                {/* Questions, for each:  */}
                <Box>
                  <Text>{props.sporsmaal[key].beskrivelse}</Text>

                  {/* Answers: for alternative in question: radiobutton + text  */}

                  <RadioGroup>
                    <Stack py={2}>
                      {props.sporsmaal[key].alternativer.map((alt, i) => (
                        <Radio
                          {...register(key)}
                          value={i.toString()}
                          key={i}
                        >
                          {alt.alt}
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
