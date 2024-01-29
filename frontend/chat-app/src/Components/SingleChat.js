import React, { useEffect, useState } from "react";
import { useChat } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
//import Loading from "./typing.json";
import "./style.css";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/Chatlogic";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import axios from "axios";
import Scrollablechat from "./Scrollablechat";
import io from "socket.io-client";
import animationData from "../animation/typing.json";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const { user, selectedchat, notification,setnotification,setselectedchat } = useChat();
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const toast = useToast();
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);

  const defaultoptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedchat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(
        `/api/message/${selectedchat._id}`,
        config
      );
      console.log(data);
      setmessages(data);
      setloading(false);
      socket.emit("join chat", selectedchat._id);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setsocketConnected(true);
    });
    socket.on("typing", () => {
      setistyping(true);
    });
    socket.on("stop typing", () => {
      setistyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notifcation
        if(!notification.includes(newMessageRecieved))
        {
          setnotification([newMessageRecieved,...notification])
          setfetchAgain(!fetchAgain)
        }

      } else {
        setmessages([...messages, newMessageRecieved]);
      }
    });
  });
console.log(notification,"...");
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedchat;
  }, [selectedchat]);
  const sendmessage = async (event) => {
    socket.emit("stop typing", selectedchat._id);
    if (event.key === "Enter" && newmessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newmessage, chatId: selectedchat._id },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setmessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error occurred",
          description: "Failed to send the message.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setnewmessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedchat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedchat._id);
        settyping(false);
      }
    }, timeLength);
  };
  return (
    <div>
      {selectedchat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              d={{ base: "flex" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedchat("")}
            />
            {!selectedchat.isGroupChat ? (
              <>
                {getSender(user, selectedchat.users)}
                {/* Pass the eye button using children prop */}
                <ProfileModel user={getSenderFull(user, selectedchat.users)}>
                  <IconButton
                    colorScheme="blue"
                    aria-label="Search database"
                    icon={<ViewIcon />}
                  />
                </ProfileModel>
              </>
            ) : (
              <>
                {selectedchat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setfetchAgain={setfetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
            p={3}
            bg="#E8E8E8"
            W="100%"
            borderRadius={"lg"}
            overFlowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf={"center"}
                margin="auto"
              />
            ) : (
              <div className="messages">
                <Scrollablechat messages={messages} />
              </div>
            )}
            <FormControl isRequired mt={3} onKeyDown={sendmessage}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultoptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
            
                  <p>
                    <a href="https://giphy.com/gifs/work-computer-typing-BDqTOfUM8nfFdxTdpY">
                      via GIPHY
                    </a>
                  </p>
                </div>
              ) : (
                <></>
              )}
              <Input
                value={newmessage}
                onChange={typingHandler}
                variant={"filled"}
                bg="#E0E0E0"
                placeholder="Enter message"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
