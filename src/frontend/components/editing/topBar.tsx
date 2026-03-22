import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Button, Flex, Group, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

export default function TopBar({
  setSelectedImage,
}: {
  setSelectedImage: any;
}) {
  const { setStep, setSelectedImg } = useWorkSession();
  const [presetId, setPresetId] = useState<string>();
  const { clearSessionData } = useSessionStore();

  return (
    <Flex
      flexDir={"row"}
      gap={4}
      p={4}
      w={"full"}
      h={"fit"}
      flexWrap={"wrap"}
      mx={"auto"}
    >
      <Button
        w={"fit"}
        variant={"subtle"}
        colorPalette={"teal"}
        onClick={() => {
          setSelectedImage(undefined);
          setSelectedImg(0);
          setStep(0);
          clearSessionData();
        }}
      >
        <LuPlus />
        Újrakezdés
      </Button>
      <Box display={"flex"} flexDir={"row"} gap={4} w={"full"}>
        <Group attached w="full" maxW="full">
          <InputGroup
            startElement="PID"
            startElementProps={{ color: "fg.muted" }}
          >
            <Input
              borderEndRadius={0}
              flex="1"
              gap={2}
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              placeholder=""
              focusRing={"none"}
              focusVisibleRing={"none"}
            />
          </InputGroup>
          <Button
            disabled={!presetId}
            bg="bg.subtle"
            variant="outline"
            onClick={() => {}}
          >
            Preset alkalmazás
          </Button>
        </Group>
      </Box>
    </Flex>
  );
}
