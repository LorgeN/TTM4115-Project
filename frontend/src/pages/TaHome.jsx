import {
  Card,
  CardHeader,
  CardBody,
  Container,
} from "@chakra-ui/react";
import { AssistanceQ } from "../components/AssistanceQ";

export const TaHome = () => {
 
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
      </Card>
    </Container>
  );
};
