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
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export const RatCard = (props) => {
  const { register, handleSubmit, errors, reset, control } = useForm();


  // TODO: replace dummydata
  let name = "RAT 7: sequence diagrams";
  let question =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, nam.";
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // TODO: save answers
    
    props.setData(data)
    
    console.log(data); //DATA FRA RAT
    
  };

  const quit = () => {
    // TODO: save progredd
    navigate("/studenthome");
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{name}</Heading>
        <Text>{props.ratType} RAT</Text>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(props.sporsmaal).map((key, i) => {
          console.log(key);
          return (
            <Card>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
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
            </Card>
          );
        })}

        <Button type="submit" colorScheme="blue">
          Test
        </Button>
        <Button onClick={quit} colorScheme="orange">
            Quit
          </Button>
      </form>

    </Card>
  );
};
