import { Card, Container, Heading, Stack, Text } from "@chakra-ui/react";

export const RatComplete = () => {
  return (
    <Container maxW={"5xl"} variant={"elevated"} marginTop={10} p={10}>
      <Card p={10}>
        <Stack alignItems={"center"}>
          <Heading>Team RAT complete!</Heading>
          <Text>
            You are done with the team RAT. You can still ask for help if
            needed.
          </Text>
        </Stack>
      </Card>
    </Container>
  );
};
