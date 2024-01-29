import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [show, setshow] = useState(false);
  const [loading, setloading] = useState(false);
  const handleclick = (e) => {
    setshow(!show);
  };

  const submitHandle = async (e) => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      console.log("log from login");
      navigate("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  return (
    <div>
      <VStack spacing={4} color={"black"}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                onClick={handleclick}
                colorScheme={"cyan"}
                h="1.75rem"
                size="sm"
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandle}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          colorScheme="red"
          width={"100%"}
          onClick={() => {
            setemail("guest@gmail.com");
            setpassword("guest@");
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </div>
  );
};

export default Login;
