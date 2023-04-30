import {
  Card,
  CardHeader,
  CardBody,
  Container,
  CardFooter,
  useDisclosure,
  Button,
  Center
} from "@chakra-ui/react";
import { AssistanceQ } from "../components/AssistanceQ";
import { AddRatModal } from "../components/AddRatModal";

export const TaHome = () => {

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
 
  return (
    <Container
      maxW={"4xl"}
      marginTop={"50"}
    >
      <Card>
        <CardHeader>

        </CardHeader>
        <CardBody paddingBottom={20}>
          <AssistanceQ></AssistanceQ>
        </CardBody>
        <Center paddingBottom={10}>
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
          onClose={onAddClose}>

          </AddRatModal>
        </Center>
      </Card>
    </Container>
  );
};
