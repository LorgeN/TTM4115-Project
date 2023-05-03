import {
  Card,
  CardHeader,
  CardBody,
  Container,
  useDisclosure,
  Button,
  Center,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { AssistanceQ } from "../components/AssistanceQ";
import { AddRatModal } from "../components/AddRatModal";
import { ManageRats } from "../components/ManageRats";
import { useState, useEffect } from "react";
import { useClient } from "../utils/useClient";
import useEvent from "../utils/useEvent";

export const TaHome = () => {
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [showAdm, setShowAdm] = useState(false);
  const {} = useClient(); // Start auth and such
  const { eventData: helpRequest, clearEvent: clearHelpRequest } =
    useEvent("request_accepted");
  const { eventData: queueLength } = useEvent("num_requests");

  return (
    <Container maxW={"4xl"} marginTop={"50"}>
      <Card>
        <CardHeader></CardHeader>
        <CardBody>
          <AssistanceQ
            helpRequest={helpRequest}
            clearHelpRequest={clearHelpRequest}
            queueLength={queueLength}
          ></AssistanceQ>

          <Divider py={5} />
          <Center py={10}>
            <VStack>
              <Button
                rounded={"full"}
                px={6}
                colorScheme={"orange"}
                bg={"orange.400"}
                _hover={{ bg: "orange.500" }}
                onClick={() => onAddOpen()}
              >
                Create new RAT
              </Button>
              <AddRatModal
                isOpen={isAddOpen}
                onOpen={onAddOpen}
                onClose={onAddClose}
              ></AddRatModal>
              <Button
                rounded={"full"}
                px={6}
                colorScheme={"orange"}
                bg={"blue.400"}
                _hover={{ bg: "blue.500" }}
                onClick={() => setShowAdm(!showAdm)}
              >
                {showAdm ? "Hide" : "Manage RATs"}
              </Button>
            </VStack>
          </Center>
          {showAdm && <ManageRats></ManageRats>}
        </CardBody>
      </Card>
    </Container>
  );
};
