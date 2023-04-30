import React from "react";
import { useCountdown } from "../components/Hook/useCountdown";
import { HStack } from "@chakra-ui/react";
import {
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

const ExpiredNotice = (props) => {

  return (
    <AlertDialog
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
          >
            Time is up!
          </AlertDialogHeader>
          <AlertDialogBody>Your answers have been saved.</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={props.setIsTimerExpired}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <HStack>
      <DateTimeDisplay
        value={minutes}
        isDanger={false}
      />
      <Text fontWeight={"bold"}>:</Text>
      <DateTimeDisplay
        value={seconds}
        isDanger={false}
      />
    </HStack>
  );
};

const DateTimeDisplay = ({ value, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <Text fontWeight={"bold"}>{value}</Text>
    </div>
  );
};

export const CountdownTimer = ({ targetDate, setIsTimerExpired }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (minutes + seconds <= 0) {
    return (
      <ExpiredNotice
        isOpen={true}
        onClose={onClose}
        setIsTimerExpired={setIsTimerExpired}
      />
    );
  } else {
    return (
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};
