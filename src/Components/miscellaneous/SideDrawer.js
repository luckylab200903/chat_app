import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  Avatar,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { getSender } from "../config/Chatlogic";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import NotificationBadge, { Effect } from 'react-notification-badge';
import { useChat } from "../../Context/ChatProvider";
import axios from "axios";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar.js/UserListItem";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setselectedchat,
    notification,
    setnotification,
    chats,
    setchats,
  } = useChat();
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState();

  const navigate = useNavigate();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please provide search query",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setloading(false);
      setsearchresult(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const logouthandler = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    // Implement logic to handle chat access
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setchats([data, ...chats]);
      }
      setselectedchat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "error loading the chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip placement="bottom-end" hasArrow label="Search Users to chat">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }}>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chat-app
        </Text>
        <Menu>
          <MenuButton marginRight="2">
          <NotificationBadge
            count={notification.length}
            effect={Effect.scale}
          />
            <BellIcon fontSize={"2xl"} m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No new messages"}
            {/* {notification.map((notif)=>{
              <MenuItem key={notif._id}>
                {notif.chat.isGroupChat?`New message from ${notif.chat.chatName}`:`New message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            })} */}
            {notification.map((notif) => (
              <MenuItem key={notif._id} onClick={()=>{
                setselectedchat(notif.chat)
                setnotification(notification.filter((n)=>n!==notif))
              }}>
                {notif.chat.isGroupChat
                  ? `New message from ${notif.chat.chatName}`
                  : `New message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            marginLeft="2"
          >
            <Avatar
              size={"sm"}
              cursor={"pointer"}
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModel>
            <MenuDivider />
            <MenuItem onClick={logouthandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer
        placement="left"
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search for users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" alignItems="center" pb={2}>
              <Input
                flex="1"
                placeholder="Search by email or name"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchresult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    accessChat(user._id);
                  }}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
