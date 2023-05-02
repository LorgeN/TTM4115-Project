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
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
// import {RatTimer} from "./RatTimer"
import { CountdownTimer } from "./RatTimer.jsx";

export const RatCard = (props) => {
  const { register, handleSubmit } = useForm();
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  useEffect(() => {
    if (isTimerExpired) {
      // console.log("EXPIRED")
      // handleSubmit()
      // FINN EN MÅTE Å SUBMITTE FORMEN
      navigate("/taketrat");
    }
  }, [isTimerExpired]);

  const navigate = useNavigate();

  const onSubmit = (formData) => {
    const fixedFormData = formData.answers.map((i) => parseInt(i, 10));
    props.onSubmit(fixedFormData);
  };

  const getTime = () => {
    // Replace with getting actual time. submit on expire
    const time = new Date();
    return time.setSeconds(time.getSeconds() + 1200);
  };
  console.log(props.questions);
  return (
    <Card>
      <CardHeader>
        <Heading size="md">RAT</Heading>
        <Text>Individual RAT</Text>
        <CountdownTimer
          targetDate={getTime()}
          setIsTimerExpired={setIsTimerExpired}
        ></CountdownTimer>
      </CardHeader>
      {props.questions && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {props.questions.map((question, i) => {
            return (
              <CardBody key={i}>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Text>{question.question}</Text>
                    <RadioGroup>
                      <Stack py={2}>
                        {question.answers.map((alt, j) => (
                          <Radio
                            {...register("answers." + i)}
                            value={j.toString()}
                            key={j}
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
            <Stack direction={"row"} spacing={2}>
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </Stack>
          </CardFooter>
        </form>
      )}
    </Card>
  );
};
