import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedchat, setselectedchat] = useState();
  const [chats, setchats] = useState([]);
  const [notification, setnotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    setuser(userinfo);
    if (!userinfo) {
      console.log("log from chat provider");
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        notification,
        setnotification,
        chats,
        setchats,
        user,
        setuser,
        selectedchat,
        setselectedchat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};

export { ChatProvider };
