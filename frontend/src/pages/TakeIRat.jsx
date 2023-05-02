import { Container } from "@chakra-ui/react";
import { RatCard } from "../components/IRatCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mqtt from "precompiled-mqtt";
import { createClient } from "../utils/client";
import HelpButton from "../components/HelpButton";

export const TakeRat = () => {
  /*const sporsmaal = {
    "questions": [
      {
        "question": "This is a question",
        "answers": [
          "This is answer 1",
          "This is answer 2",
          "This is answer 3",
          "This is answer 4 (CORRECT)"
        ],
        "correct_answer": 3
      },
      {
        "question": "This is a question",
        "answers": [
          "This is answer 1",
          "This is answer 2",
          "This is answer 3",
          "This is answer 4 (CORRECT)"
        ],
        "correct_answer": 3
      }
    ]
  }; */ // dette er hardkodet JSON, kunne like gjerne vært fra mqtt

  const navigate = useNavigate();
  const [client] = useState(createClient());
  const [data, setData] = useState(); //data fra RAT
  const [sporsmaal, setSporsmaal] = useState();

  useEffect(() => {
    if (!data) {
      return;
    }

    console.log(data);

    client.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({ event: "question_answer", data: { answers: data } }),
      1,
      (error) => {
        if (error) {
          console.log("Publish error: ", error);
        } else {
          navigate("/waitingroom");
        }
      }
    );
  }, [data]);

  useEffect(() => {
    client.on("message", (topic, message) => {
      const res = JSON.parse(message);
      console.log(res);

      if (res.event === "questions") {
        setSporsmaal(res.data);
      }
    });

    client.on("connect", () => {
      console.log("connected");
      client.subscribe(localStorage.getItem("outbound"), "0");
      client.publish(
        localStorage.getItem("inbound"),
        JSON.stringify({ event: "start_rat" }),
        1,
        () => {}
      );
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return (
    <Container marginTop={10}>
      <HelpButton />
      <RatCard
        ratType={"Individual"}
        sporsmaal={sporsmaal}
        setData={setData}
      ></RatCard>
    </Container>
  );
};
