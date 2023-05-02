import { Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TRatCard } from "../components/TRatCard";
import { CLIENT } from "../utils/client";

export const TakeTRat = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState();
  const [selected, setSelected] = useState();

  const onSubmit = () => {
    if (!selected) {
      return;
    }

    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({ event: "answer_confirmed" }),
      0
    );
  };

  useEffect(() => {
    if (!selected) {
      return;
    }

    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({
        event: "question_answer",
        data: { answer: selected },
      }),
      0
    );
  }, [selected]);

  useEffect(() => {
    const listener = (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);

      if (res.event === "new_question") {
        setQuestion(res.data);
      } else if (res.event === "question_answer_select") {
        setSelected(res.data.answer)
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, []);

  return (
    <Container marginTop={10}>
      <TRatCard
        question={question}
        selected={selected}
        setSelected={setSelected}
        onSubmit={onSubmit}
      ></TRatCard>
    </Container>
  );
};
