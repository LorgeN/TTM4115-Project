
import { Container } from "@chakra-ui/react";
import { RatCard } from "../components/RatCard";

export const TakeRat = () => {
  return (
    <Container marginTop={10}>
        

        <RatCard ratType={"Individual"}></RatCard>
        
    </Container>
  );
};
