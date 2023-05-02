import { Card, Container, Heading, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT } from "../utils/client";

export const WaitingRoom = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const listener = (topic, message) => {
      const res = JSON.parse(message);
      if (res.event === "start_team_rat") {
        navigate("/TakeTRat");
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, []);

  return (
    <Container maxW={"5xl"} variant={"elevated"} marginTop={10} p={10}>
      <Card p={10}>
        <Stack alignItems={"center"}>
          <Heading>Waiting to start Team RAT </Heading>
        </Stack>
      </Card>
    </Container>
  );
};
