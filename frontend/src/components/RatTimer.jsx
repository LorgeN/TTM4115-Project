import React from 'react';
import { useCountdown } from '../components/Hook/useCountdown';
import { HStack } from '@chakra-ui/react';
import {
    Text,
  } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const ExpiredNotice = () => {
    
    const navigate = useNavigate()
    navigate("/studenthome")
    // return (
    //   <div className="expired-notice">
    //     <span>Expired!!!</span>
    //     <p>Please select a future date and time.</p>
    //   </div>
    // );
    
  };

  const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <HStack>
          <DateTimeDisplay value={minutes} isDanger={false} />
          <Text fontWeight={"bold"}>:</Text>
          <DateTimeDisplay value={seconds} isDanger={false} />
        </HStack>
    );
  };


const DateTimeDisplay = ({ value, isDanger }) => {
  return (
    <div className={isDanger ? 'countdown danger' : 'countdown'}>
        <Text fontWeight={"bold"}>{value}</Text>
    </div>
  );
};

export const CountdownTimer = ({ targetDate, setIsTimerExpired }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const navigate = useNavigate()

  if (minutes + seconds <= 0) {
    setIsTimerExpired(true)
    // navigate("/studenthome")
    // return <ExpiredNotice />;
    return
  } else {
    return (
      <ShowCounter
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};
