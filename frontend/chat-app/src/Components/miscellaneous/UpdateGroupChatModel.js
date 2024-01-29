import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useChat } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar.js/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar.js/UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setfetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedchat, setselectedchat, user } = useChat();
  const [groupchatname, setgroupchatname] = useState();
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameloading, setrenameloading] = useState(false);
  const toast = useToast();
  const handleremove = async (user1) => {
    if (selectedchat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedchat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setselectedchat() : setselectedchat(data);
      setfetchAgain(!fetchAgain);
      fetchMessages()
      setloading(false);
    } catch (error) {
      toast({
        title: "error Occured",
        description: "We've created your account for you.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setloading(false);
    }
  };
  const handleRename = async () => {
    if (!groupchatname) {
      return;
    }
    try {
      setrenameloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedchat._id,
          chatName: groupchatname,
        },
        config
      );

      setselectedchat(data);
      setfetchAgain(!fetchAgain);
      setrenameloading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setrenameloading(false);
    }
    setgroupchatname("");
  };

  const handleAddUser = async (user1) => {
    if (selectedchat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (selectedchat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone",
        status: "error",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedchat._id,
          userId: user1._id,
        },
        config
      );
      setselectedchat(data);
      setfetchAgain(!fetchAgain);
      setloading(false);
    } catch (error) {
      toast({
        title: "error Occured",
        description: "We've created your account for you.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setloading(false);
    }
  };
  const handleSearch = async (query) => {
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
      setloading(false);
    }
  };
  return (
    <>
      <IconButton icon={<ViewIcon />} d={{ base: "flex" }} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={"center"}
          >
            {selectedchat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap={"wrap"} pb={3}>
              {selectedchat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleremove(u)}
                />
              ))}
            </Box>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupchatname}
                onChange={(e) => setgroupchatname(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchresult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleremove(user)}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
