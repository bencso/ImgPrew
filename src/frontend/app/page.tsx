"use client";

import { useWorkSession } from "@/providers/sessionprovider";
import {
  AbsoluteCenter,
  Box,
  Button,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { BeatLoader, PuffLoader } from "react-spinners";

export default function Page() {
  const [loading, setLoading] = useState(false);

  return (
    <AbsoluteCenter
      w={"full"}
      px={{
        smDown: 4,
        base: 8,
      }}
    >
      <Stack
        mx={4}
        fontSize="sm"
        w={{
          smDown: "full",
          base: "lg",
        }}
        px={{
          smDown: 6,
          base: 12,
        }}
        py={{
          smDown: 8,
          base: 10,
        }}
        borderRadius="xl"
        backgroundColor={"bg.panel"}
        borderColor={"border.muted"}
        borderWidth={1}
        gap={8}
        boxShadow={"sm"}
      >
        <Stack gap={3} alignItems={"center"}>
          <Image src={"/logo.png"} boxSize={16} />
          <Heading
            as={"h1"}
            fontSize={{
              smDown: "lg",
              base: "2xl",
            }}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Folytasd ahol abbahagytad
          </Heading>
          <Text
            fontSize={{
              smDown: "sm",
              base: "md",
            }}
            color="gray.500"
            lineHeight={"tall"}
            textAlign="center"
            maxW="sm"
          >
            Jelentkezz be Google fiókoddal.
          </Text>
        </Stack>

        <Stack gap={4}>
          <Button
            type="button"
            w={"full"}
            size={{
              smDown: "sm",
              base: "lg",
            }}
            loading={loading}
            display={"flex"}
            alignItems={"center"}
            variant={"solid"}
            gap={2}
            colorPalette={"teal"}
            spinner={<BeatLoader size={12} color={"#004d40"} />}
          >
            <FaGoogle /> Bejelentkezés Google-vel
          </Button>

          <Text
            fontSize="xs"
            color="gray.500"
            textAlign="center"
            maxW="xs"
            lineHeight={"tall"}
            mx="auto"
          >
            A bejelentkezéssel elfogadod a{" "}
            <Link my={1} href="/adatvedelem">
              felhasználási feltételeket
            </Link>
            és az
            <Link ms={1} href="/adatvedelem">
              adatvédelmi irányelveket.
            </Link>
          </Text>
        </Stack>
      </Stack>
    </AbsoluteCenter>
  );
}
