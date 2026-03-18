"use client";

import keyboardShortcuts from "@/components/editing/keyboardShortCuts";
import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SideBar from "@/components/editing/sidebar";
import BottomBar from "@/components/editing/moreImagesBottomBar";
import TopBar from "@/components/editing/topBar";
import ImageWorkPlace from "@/components/editing/webglComponents";

export default function Page() {
  //#region contextek
  const { step, imgs, setStep, setImgs, setSelectedImg, selectedImg } =
    useWorkSession();
  const [selectedImage, setSelectedImage] = useState<string>();

  const { ws, sendMessage } = useWebsocket();
  const { setExifDataForImage, setCaptionSamplesForImage, addImage } =
    useSessionStore();
  //#endregion

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false, fallback: "md" },
  );
  //#endregion

  useEffect(() => {
    setSelectedImage(imgs[selectedImg]);
  }, [selectedImg, imgs]);

  //#region WebSocket kezelés
  useEffect(() => {
    const wscurr = ws.current;
    if (!wscurr) return;  

    const messageHandler = (event: MessageEvent) => {
      handleMessage(
        event,
        setStep,
        setImgs,
        setExifDataForImage,
        setCaptionSamplesForImage,
        addImage,
      );
    };

    wscurr.addEventListener("message", messageHandler);

    return () => {
      wscurr.removeEventListener("message", messageHandler);
    };
  }, [ws]);
  //#endregion

  keyboardShortcuts({
    selectedImg,
    sendMessage,
    setImgs,
    setSelectedImage,
    setSelectedImg,
    setStep,
    step,
    imgs,
  });

  if (step === 0) return <ImageDropZone ws={ws} sendMessage={sendMessage} />;
  if (step === 1)
    return (
      <Flex
        direction={!isMd ? "column" : "row"}
        h="full"
        w="full"
        minW="0"
        minH={"0"}
        flex="1"
      >
        <Flex h="full" w="full" minW="0" minH={"0"} flex="1" direction="column">
          <TopBar setSelectedImage={setSelectedImage} />
          <Box flex="1" minH="0" p={4}>
            {selectedImage && <ImageWorkPlace />}
          </Box>
          <BottomBar />
        </Flex>

        <Flex
          w={isMd ? "fit" : "full"}
          h={!isMd ? "fit" : "full"}
          minH="0"
          minW="0"
          flexShrink={0}
          direction={isMd ? "column" : "row"}
          borderLeftWidth={isMd ? "1px" : 0}
          borderColor="border.disabled"
        >
          <SideBar />
        </Flex>
      </Flex>
    );
}
