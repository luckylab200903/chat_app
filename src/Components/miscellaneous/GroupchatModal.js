import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useChat } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar.js/UserListItem";
import UserBadgeItem from "../UserAvatar.js/UserBadgeItem";

const GroupchatModal = ({ children }) => {
  const { user, chats, setchats } = useChat();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupchatname, setgroupchatname] = useState();
  const [selectedusers, setselectedusers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();

  const handlesearch = async (query) => {
    setsearch(query);
    if (!query) {
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log(data);
      setloading(false);
      setsearchresult(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: error.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handledelete = (userToDelete) => {
    const updatedUsers = selectedusers.filter((user) => user !== userToDelete);
    setselectedusers(updatedUsers);
  };

  const handleSubmit = async () => {
    if (!groupchatname || !selectedusers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupchatname,
          users: JSON.stringify(selectedusers.map((u) => u._id)),
        },
        config
      );
      setchats([data,...chats])
      onClose()
      toast({
        title: 'New Group chat created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

    } catch (error) {
        toast({
            title: 'Error in creating the group chat',
            description: error.message,
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
    }
  };

  const handlegroup = (userToadd) => {
    if (selectedusers.includes(userToadd)) {
      toast({
        title: "User already exists",
        description: "User exists",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setselectedusers([...selectedusers, userToadd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={"center"}
          >
            Create Group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <FormLabel>Group Chat Name</FormLabel>
              <Input
                type="email"
                mb={3}
                onChange={(e) => {
                  setgroupchatname(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Add users</FormLabel>
              <Input
                type="name"
                mb={1}
                onChange={(e) => {
                  handlesearch(e.target.value);
                }}
              />
            </FormControl>
            {/** render search users */}
            <Box w="100%" d="flex" flexWrap={"wrap"}>
              {selectedusers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handledelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchresult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handlegroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupchatModal;
