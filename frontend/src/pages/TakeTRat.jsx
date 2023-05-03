import { Container, Card, Stack, Heading, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRatCard } from "../components/TRatCard";
import { useClient } from "../utils/useClient";

export const TakeTRat = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const toast = useToast();
  const { publish } = useClient();

  const { eventData: teamRatStarted } = useEvent("start_team_rat");
  const { started } = useCallback(
    (teamRatStarted) => !!teamRatStarted,
    [teamRatStarted]
  );

  const { eventData: question } = useEvent("new_question");
  useEffect(() => setSelected(undefined), [question]);

  const { eventData: answerSelect } = useEvent("question_answer_select");
  useEffect(() => setSelected(answerSelect.answer), [answerSelect]);

  const { eventData: answerConfirm } = useEvent("question_answer_confirm");
  useEffect(() => {
    const correct = answerConfirm.is_correct;

    toast({
      title: correct ? "Correct!" : "Wrong!",
      description: correct
        ? "You got it right!"
        : "You got it wrong! Try again.",
      status: correct ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (correct) {
      setCurrentQuestion((curr) => curr + 1);
    }
  }, [answerConfirm]);

  const { eventData: ratComplete } = useEvent("rat_complete");
  useEffect(() => {
    if (ratComplete) {
      navigate("/studenthome");
    }
  }, [ratComplete]);

  const onSubmit = () => {
    if (selected === undefined || selected === null) {
      return;
    }

    publish({ event: "answer_confirmed" });
  };

  const publishSelected = (newSelected) => {
    if (newSelected === undefined || newSelected === null) {
      return;
    }

    publish({
      event: "question_answer",
      data: { answer: newSelected },
    });
  };

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
          currentQuestion={currentQuestion}
          selected={selected}
          setSelected={setSelected}
          onSubmit={onSubmit}
          publishSelected={publishSelected}
        ></TRatCard>
      </Container>
    );
  }
};
