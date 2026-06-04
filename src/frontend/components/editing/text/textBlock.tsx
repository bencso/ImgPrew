import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Accordion,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Span,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCheck, LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { shallow } from "zustand/shallow";
import { TextBlockColor } from "./textblocks/colorBlock";
import { TextBlockPosition } from "./textblocks/positionBlock";
import { TextBlockSize } from "./textblocks/sizeBlock";
import { TextBlockWeight } from "./textblocks/weightBlock";
import { TextBlockFamily } from "./textblocks/fontFamilyBlock";

export default function TextBlock() {
  const { selectedImg, textElements, textAndImagePlaceRef, imageScale } = useWorkSession();
  const { addTexts, deleteText, getTextPosition, editText } = useSessionStore();

  const texts = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.texts || [],
    shallow,
  );

  const [editId, setEditId] = useState<string | null>(null);
  const [text, setText] = useState("");

  const textFromStore = useSessionStore(
    (s) =>
      s.sessionData
        .find((i) => i.id === selectedImg)
        ?.texts?.find((ti) => ti.id === editId)?.text || "",
    shallow,
  );

  useEffect(() => {
    if (!editId) return;
    setText(textFromStore);
  }, [editId, textFromStore]);

  return (
    <Box>
      <Flex gap={2}>
        <Input
          placeholder="Szöveg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outline"
        />
        <IconButton
          variant={"ghost"}
          onClick={() => {
            if (!text) return;
            if (!editId) {
              addTexts(selectedImg, text, textAndImagePlaceRef);
            } else {
              editText(selectedImg, editId, text);
            }
            setEditId(null);
            setText("");
          }}
        >
          {!editId ? <LuPlus /> : <LuCheck />}
        </IconButton>
      </Flex>

      {texts.length > 0 && (
        <Stack gap="2" mt={4}>
          <Accordion.Root variant="enclosed" collapsible>
            {texts.map((text) => {
              const element = textElements[text.id];

              if (!element) return;
              const textPosition = getTextPosition(selectedImg, text.id, imageScale);

              return (
                <Accordion.Item key={text.id} value={text.id}>
                  <Accordion.ItemTrigger>
                    <Span
                      overflow={"hidden"}
                      maxW={"full"}
                      textWrap={"nowrap"}
                      flex="1"
                    >
                      {text.text}
                    </Span>

                    <Box
                      p={1}
                      borderRadius={"md"}
                      color={"cyan.400"}
                      border={"1px solid"}
                      borderColor={"cyan.700/50"}
                      _hover={{
                        bgColor: "cyan.700/50",
                      }}
                      key={text.id + "-edit"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditId(text.id);
                      }}
                    >
                      <LuPen />
                    </Box>
                    <Box
                      p={1}
                      borderRadius={"md"}
                      color={"red.400"}
                      border={"1px solid"}
                      borderColor={"red.700/50"}
                      _hover={{
                        bgColor: "red.700/50",
                      }}
                      key={text.id + "-delete"}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteText(selectedImg, text.id);
                      }}
                    >
                      <LuTrash />
                    </Box>
                  </Accordion.ItemTrigger>

                  <Accordion.ItemContent>
                    <Accordion.ItemBody gap={4} display="flex" flexDir="column">
                      <TextBlockSize id={text.id} fontSize={text.fontSize} />
                      <TextBlockFamily
                        id={text.id}
                        fontFamily={text.fontFamily}
                      />
                      <TextBlockWeight
                        id={text.id}
                        fontWeight={text.fontWeight}
                        fontFamily={text.fontFamily}
                      />
                      <TextBlockColor id={text.id} color={text.color} />
                      <TextBlockPosition
                        id={text.id}
                        position={text.position}
                        textPosition={textPosition}
                      />
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </Stack>
      )}
    </Box>
  );
}
