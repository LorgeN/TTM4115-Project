import React, { useState } from "react";
import useEvent from "../utils/useEvent";
import { Button } from "@chakra-ui/react";

const HelpButton = () => {
  const [requestedHelp, setRequestedHelp] = useState(false);
  const { eventData: queuePositionData } = useEvent("queue_update");
  const { eventData: requestComplete, clearEvent: clearRequestComplete } =
    useEvent("help_request_completed");
  const { publishEvent: publishHelpRequest } = useEvent("request_help");
  const { publishEvent: cancelHelpRequest } = useEvent("request_cancel");

  const requestHelp = () => {
    publishHelpRequest();
    setRequestedHelp(true);
  };

  const cancelHelp = () => {
    cancelHelpRequest();
    setRequestedHelp(false);
  };

  useEffect(() => {
    if (requestComplete && requestedHelp) {
      setRequestedHelp(false);
      clearRequestComplete();
    }
  }, [requestComplete, requestedHelp]);

  return (
    <div>
      {requestedHelp ? (
        <Tooltip
          hasArrow
          label={`Position: ${queuePositionData?.position ?? "?"}`}
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
