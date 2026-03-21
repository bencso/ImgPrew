"use client";

import {
  Button,
  Heading,
  Highlight,
  HStack,
  Image,
  Stack,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Center minH="100vh" p={4}>
      <Stack
        gap={10}
        p={12}
        minW={"xl"}
        maxW={"xl"}
        rounded="2xl"
        shadow="xl"
        align="center"
      >
        <Stack gap={3} textAlign="center">
          <Heading size="2xl">
            <Highlight query="fiókjába" styles={{ color: "teal.500" }}>
              Jelentkezzen be fiókjába
            </Highlight>
          </Heading>
          <Text fontSize={"md"} color="fg.muted">
            Üdvözöljük újra!
            <br /> Kérjük, jelentkezzen be a folytatáshoz.
          </Text>
        </Stack>
        <HStack w="full" justify="center">
          <Button
            onClick={handleLogin}
            colorPalette={"teal"}
            w="full"
            variant={"surface"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={3}
            spinner={<BeatLoader size={8} color="white" />}
          >
            Google
          </Button>
        </HStack>
      </Stack>
    </Center>
  );
}
