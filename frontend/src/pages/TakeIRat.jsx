import { Container, useToast } from "@chakra-ui/react";
import { RatCard } from "../components/IRatCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../utils/useClient";
import useEvent from "../utils/useEvent";

export const TakeIRat = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { publish } = useClient();
  const { eventData } = useEvent("questions");

  const onSubmit = (answers) => {
    if (answers.some((x) => isNaN(x))) {
      toast({
        title: "Missing answers!",
        description: "One or more questions have not been answered.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    publish({ event: "question_answer", data: { answers } }, () => {
      navigate("/taketrat");
    });
  };

  useEffect(() => {
    publish({ event: "start_rat" });
  }, []);

  return (
    <Container marginTop={10}>
      {eventData && (
        <RatCard questions={eventData.questions} onSubmit={onSubmit}></RatCard>
      )}
    </Container>
  );
};
