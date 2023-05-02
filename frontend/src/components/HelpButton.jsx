import React, { useState, useEffect } from "react";
import useEvent from "../utils/useEvent";
import { Button, Tooltip, useToast } from "@chakra-ui/react";

const HelpButton = () => {
  const [requestedHelp, setRequestedHelp] = useState(false);
  const { eventData: queuePositionData } = useEvent("queue_update");
  const { eventData: requestComplete, clearEvent: clearRequestComplete } =
    useEvent("help_request_completed");
  const { publishEvent: publishHelpRequest } = useEvent("request_help");
  const { publishEvent: cancelHelpRequest } = useEvent("request_cancel");
  const toast = useToast();

  const requestHelp = () => {
    publishHelpRequest();
    setRequestedHelp(true);

    toast({
      title: "Help request",
      description: "We've submitted your request for help from the TAs",
      status: "success",
      duration: 10000,
      isClosable: true,
    });
  };

  const cancelHelp = () => {
    cancelHelpRequest();
    setRequestedHelp(false);

    toast({
      title: "Help request cancelled",
      description: "Your request was cancelled",
      status: "success",
      duration: 10000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (requestComplete && requestedHelp) {
      setRequestedHelp(false);
      clearRequestComplete();

      toast({
        title: "Help request complete",
        description: "Your request was marked as complete by a TA",
        status: "info",
        duration: 10000,
        isClosable: true,
      });
    }
  }, [requestComplete, requestedHelp]);

  return (
    <div>
      {requestedHelp ? (
        <Tooltip
          hasArrow
          label={`You are number ${
            queuePositionData?.position ?? "?"
          } in the queue`}
        >
          <Button onClick={cancelHelp}>Cancel Help Request</Button>
        </Tooltip>
      ) : (
        <Button onClick={requestHelp}>Request Help</Button>
      )}
    </div>
  );
};

export default HelpButton;
