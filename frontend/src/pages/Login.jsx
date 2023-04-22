import {
  Center,
  Button,
  Card,
  VStack,
  HStack,
  Wrap,
  Container,
  Heading,
  StackDivider,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [LoggedIn, setLoggedIn] = useState(false);
  const [TeamNumber, setTeamNumber] = useState();
  const [User, setUser] = useState();

  const identity = (team) => {
    setTeamNumber((TeamNumber) => team);
    const Name = prompt("Enter your name");
    setUser((user) => Name);
    setLoggedIn(!LoggedIn);
  };

  if (LoggedIn) {
    localStorage.setItem("TeamNumber", TeamNumber);
    localStorage.setItem("User", User);
    navigate("/studenthome");
  } else {
    return (
      <Center>
        <Container m="5%" bg="gray.50">
          <HStack divider={<StackDivider borderColor="gray.200" />}>
            <VStack spacing={5} width="50%" border="black">
              <Heading size="md"> Which Team?</Heading>
              <Wrap>
                {teams.map(function (team) {
                  return (
                    <Card>
                      <Button onClick={() => identity(team)}>{team}</Button>
                    </Card>
                  );
                })}
              </Wrap>
            </VStack>

            <VStack spacing={5} width="50%">
              <Center>
                <Button maxW="960px" mx="auto">
                  Join as student assistant
                </Button>
              </Center>
            </VStack>
          </HStack>
        </Container>
      </Center>
    );
  }
};
