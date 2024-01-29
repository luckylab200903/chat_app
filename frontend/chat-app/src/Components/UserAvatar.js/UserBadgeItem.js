import { Box, CloseButton } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      d="flex"
      flexDir={"row"}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      color={"white"}
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <CloseButton />
    </Box>
  );
};

export default UserBadgeItem;
