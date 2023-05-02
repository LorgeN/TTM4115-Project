import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, StarIcon } from "@chakra-ui/icons";

const ratList = [
  {
    name: "Sequence diagrams",
    isActive: "Yes",
    numStudents: 29,
    numTeams: 2,
  },
  {
    name: "State machines",
    isActive: "No",
    numStudents: 42,
    numTeams: 15,
  },
  {
    name: "Communication",
    isActive: "No",
    numStudents: 43,
    numTeams: 16,
  },
  {
    name: "Interactions",
    isActive: "No",
    numStudents: 43,
    numTeams: 16,
  },
];

const tableEntries = () => {
  return ratList.map((rat) => (
    <Tr>
      <Td>{rat.name}</Td>
      <Td>{rat.isActive}</Td>
      <Td isNumeric>{rat.numStudents}</Td>
      <Td isNumeric>{rat.numTeams}</Td>
      <Td isNumeric>
          <IconButton
            rounded={"3xl"}
            icon={<StarIcon />}
          ></IconButton>
              <IconButton
                mx={1}
                rounded={"3xl"}
                icon={<EditIcon />}
              ></IconButton>
              <IconButton
                rounded={"3xl"}
                icon={<DeleteIcon />}
              ></IconButton>
            </Td>
    </Tr>
  ));
};

export const ManageRats = () => {
  return (
    <TableContainer p={3} marginBottom={10}>
      <Table variant="simple" size={"sm"}>
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
        <Thead>
          <Tr>
            <Th>rat</Th>
            <Th > Active </Th>
            <Th isNumeric>Students completed</Th>
            <Th isNumeric> Teams completed</Th>
            <Th isNumeric> Manage </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableEntries()}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
