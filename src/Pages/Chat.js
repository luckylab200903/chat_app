import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useChat } from "../Context/ChatProvider.js";
import SideDrawer from "../Components/miscellaneous/SideDrawer.js";
import MyChat from "../Components/miscellaneous/MyChat.js";
import ChatBox from "../Components/miscellaneous/ChatBox.js";

const Chat = () => {
  const { user } = useChat();
  const [fetchAgain,setfetchAgain]=useState(false)


  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" p="20px" w="100%" h="100%">
        {user && <MyChat mr={4} fetchAgain={fetchAgain} style={{marginRight:"10px"}}/>}
        {user && <ChatBox  fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
      </Box>
    </div>
  );
};

export default Chat;
