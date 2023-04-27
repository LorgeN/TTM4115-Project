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
  import { useState, useEffect } from "react";
  
  export const TRatCard = (props) => {
    const { register, handleSubmit, errors, reset, control } = useForm();
    const [currentQ, setCurrentQ] = useState(1);
    const [key, setKey]=useState("spm1")
  
  
    // TODO: replace dummydata
    let name = "RAT 7: sequence diagrams";
    const navigate = useNavigate();

    useEffect(() => {
      }, [key]);
  
    const handleNext = () => {
        // Dette under her må fiskes 
        
        setCurrentQ(currentQ+1)
        setKey("spm"+currentQ.toString())
        // get next q 
    }

    const onSubmit = (data) => {   
        // check correct
        // update color. If correct, enable next, if wrong disable radio
        // set disabled submit button 
        setCurrentQ(currentQ+1) // remove
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
              <Card>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Text>{props.sporsmaal[key].beskrivelse}</Text>
  
  
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
          <Button type="submit" colorScheme="blue">
            Test
          </Button>
          <Button onClick={handleNext} colorScheme="orange">
              Next
            </Button>
        </form>
  
      </Card>
    );
  };
  