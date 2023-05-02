import { Container, list } from "@chakra-ui/react";
import { RatCard } from "../components/IRatCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpButton from "../components/HelpButton";
import { CLIENT } from "../utils/client";

export const TakeRat = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(); //data fra RAT
  const [sporsmaal, setSporsmaal] = useState();

  useEffect(() => {
    if (!data) {
      return;
    }

    console.log(data);

    CLIENT.publish(
      localStorage.getItem("inbound"),
      JSON.stringify({ event: "question_answer", data: { answers: data } }),
      0,
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
        setSporsmaal(res.data);
      }
    };

    CLIENT.on("message", listener);

    return () => {
      CLIENT.removeListener("message", listener);
    };
  }, []);

  return (
    <Container marginTop={10}>
      <RatCard
        ratType={"Individual"}
        sporsmaal={sporsmaal}
        setData={setData}
      ></RatCard>
    </Container>
  );
};
