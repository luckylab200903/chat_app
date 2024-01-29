import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [pic, setpic] = useState();
  const [show, setshow] = useState(false);
  const [showc, setshowc] = useState(false);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleonchange = (e) => {
    setname(e.target.value);
  };

  const handleclick = () => {
    setshow(!show);
  };

  const handlecclick = () => {
    setshowc(!showc);
  };

  const submitHandle = async () => {
    setloading(true);

    if (!name || !password || !email || !confirmpassword) {
      toast({
        title: "Please fill in all the fields",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setloading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Password and confirm password don't match",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const postData = {
        username: name,
        email,
        password,
        pic,
      };

      const { data } = await axios.post("/api/user", postData, config);

      toast({
        title: "Account created successfully.",
        status: "success",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });

      localStorage.setItem("userinfo", JSON.stringify(data));

      setloading(false);
      console.log("log from sign up");
      navigate("/chat");
    } catch (error) {
      console.error("Error:", error.response.data);
      toast({
        title: "Error occurred",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setloading(false);
    }
  };

  const postImage = (pics) => {
    setloading(true);

    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setloading(false);
      return;
    }

    if (
      pics.type === "image/jpg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpeg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "hkzsskx2");
      data.append("cloud_name", "dtekkvnmz");

      fetch("https://api.cloudinary.com/v1_1/dtekkvnmz/image/upload", {
        method: "post",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setpic(data.secure_url);
          setloading(false);
        })
        .catch((err) => {
          console.error("Error uploading image to Cloudinary:", err.message);
          setloading(false);
        });
    } else {
      toast({
        title: "Please select an image of type JPG, PNG, or JPEG",
        status: "warning",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
      setloading(false);
    }
  };

  return (
    <VStack spacing={4} color={"black"}>
      <FormControl id="firstname" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          type="text"
          onChange={handleonchange}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          type="email"
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

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showc ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => {
              setconfirmpassword(e.target.value);
            }}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              onClick={handlecclick}
              colorScheme={"cyan"}
              h="1.75rem"
              size="sm"
            >
              {showc ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture" isRequired>
        <FormLabel>Upload picture</FormLabel>
        <Input
          placeholder="Upload picture"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postImage(e.target.files[0]);
          }}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandle}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
