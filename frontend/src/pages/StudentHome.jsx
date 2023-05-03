import {
  Button,
  Card,
  VStack,
  Container,
  CardHeader,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClient } from "../utils/useClient";
import { useSession } from "../utils/useSession";

export const StudentHome = () => {
  const navigate = useNavigate();
  useAuth();
  const {} = useClient(); // Start auth and such
  const { name } = useSession();

  const startRat = () => {
    navigate("/takeirat");
  };

  return (
    <Container maxW={"4xl"} marginTop={"50"}>
      <Card>
        <CardHeader>
          <Heading size="md"> Welcome Back, {name}!</Heading>
        </CardHeader>
        <CardBody>
          <VStack py={10} spacing={10}>
            <Button onClick={startRat} colorScheme={"blue"}>
              Take RAT
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
