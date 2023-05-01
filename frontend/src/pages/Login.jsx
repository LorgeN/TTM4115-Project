import {
  Center,
  Button,
  VStack,
  HStack,
  Wrap,
  Container,
  Heading,
  StackDivider,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const handle_student_login = (team) => {
    const name = prompt("Enter your name");
    localStorage.setItem("TeamNumber", team);
    localStorage.setItem("User", name);
    navigate("/studenthome");
  };

  const handle_facilitator_login = () => {
    const name = prompt("Enter your name");
    localStorage.setItem("User", name);
    navigate("/tahome");
  };

  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Team based learning{" "}
          <Text as={"span"} color={"orange.400"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Streamline the process of conducting individual and team based
          readiness assurance tests (RAT), as well as queuing for helo from a
          teaching assistant! Each student can efficiently conduct and deliver
          their individual RAT. Once all team members have completed their
          individual test the team will be able to start the team based RAT
          where they get immediate feedback on their answers.
        </Text>

        <HStack p={10} divider={<StackDivider borderColor="gray.200" />}>
          <VStack spacing={5} width="50%" border="black">
            <Heading size="md"> Which Team?</Heading>
            <Wrap>
              {teams.map(function (team) {
                return (
                  <Button
                    variant={"outline"}
                    colorScheme="orange"
                    onClick={() => handle_student_login(team)}
                  >
                    {team}
                  </Button>
                );
              })}
            </Wrap>
          </VStack>

          <VStack spacing={5} width="50%">
            <Center>
              <Button
                variant={"outline"}
                colorScheme={"orange"}
                maxW="960px"
                mx="auto"
                onClick={() => handle_facilitator_login()}
              >
                Join as student assistant
              </Button>
            </Center>
          </VStack>
        </HStack>
      </Stack>
    </Container>
  );
};
