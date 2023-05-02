import { Container, useToast } from "@chakra-ui/react";
import { RatCard } from "../components/IRatCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT } from "../utils/client";

export const TakeIRat = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [questions, setQuestions] = useState();

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

    console.log(answers);

    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({ event: "question_answer", data: { answers } }),
      0,
      (error) => {
        if (error) {
          console.log("Publish error:", error);
        } else {
          navigate("/taketrat");
        }
      }
    );
  };

  useEffect(() => {
    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({ event: "start_rat" }),
      1,
      () => {}
    );

    const listener = (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);

      if (res.event === "questions") {
        setQuestions(res.data);
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, []);

  return (
    <Container marginTop={10}>
      <RatCard questions={questions} onSubmit={onSubmit}></RatCard>
    </Container>
  );
};
