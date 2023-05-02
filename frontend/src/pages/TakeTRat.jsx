import { Container, Card, Stack, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRatCard } from "../components/TRatCard";
import { CLIENT } from "../utils/client";

export const TakeTRat = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState();
  const [selected, setSelected] = useState();
  const toast = useToast();

  const onSubmit = () => {
    if (selected === undefined || selected === null) {
      return;
    }

    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({ event: "answer_confirmed" }),
      0
    );
  };

  const publishSelected = (newSelected) => {
    if (newSelected === undefined || newSelected === null) {
      return;
    }

    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({
        event: "question_answer",
        data: { answer: newSelected },
      }),
      0
    );
  };

  useEffect(() => {
    const listener = (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);

      if (res.event === "start_team_rat") {
        setStarted(true);
      } else if (res.event === "new_question") {
        setQuestion(res.data);
        setSelected(undefined);
      } else if (res.event === "question_answer_select") {
        setSelected(res.data.answer);
      } else if (res.event === "question_answer_confirm") {
        const correct = res.data.is_correct;
        toast({
          title: correct ? "Correct!" : "Wrong!",
          description: correct
            ? "You got it right!"
            : "You got it wrong! Try again.",
          status: correct ? "success" : "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, []);

  if (!started) {
    return (
      <Container maxW={"5xl"} variant={"elevated"} marginTop={10} p={10}>
        <Card p={10}>
          <Stack alignItems={"center"}>
            <Heading>Waiting to start Team RAT </Heading>
          </Stack>
        </Card>
      </Container>
    );
  } else {
    return (
      <Container marginTop={10}>
        <TRatCard
          question={question}
          selected={selected}
          setSelected={setSelected}
          onSubmit={onSubmit}
          publishSelected={publishSelected}
        ></TRatCard>
      </Container>
    );
  }
};
