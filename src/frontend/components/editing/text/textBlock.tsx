import { DraggableImageEvent } from "@/interfaces/draggableElement";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Accordion,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  NumberInput,
  Portal,
  Select,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createListCollection } from "@chakra-ui/react";

const fontWeightCollection = createListCollection({
  items: [
    { label: "Thin", value: "100" },
    { label: "Extra Light", value: "200" },
    { label: "Light", value: "300" },
    { label: "Normal", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semi Bold", value: "600" },
    { label: "Bold", value: "700" },
    { label: "Extra Bold", value: "800" },
    { label: "Black", value: "900" },
  ],
});

export default function TextBlock() {
  const { selectedImg } = useWorkSession();
  const { addTexts, getTexts, sessionData, setTextFontSize } =
    useSessionStore();
  const [text, setText] = useState<string>("");
  const [texts, setTexts] = useState<DraggableImageEvent[]>([]);

  useEffect(() => {
    setTexts(getTexts(selectedImg));
  }, [sessionData, selectedImg]);

  return (
    <Box>
      <Flex gap={2}>
        <Input
          placeholder="Szöveg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outline"
        />
        <Button
          variant="outline"
          colorPalette="teal"
          onClick={() => {
            if (text) addTexts(selectedImg, text);
            setText("");
          }}
        >
          Hozzááadás
        </Button>
      </Flex>

      <Stack gap="2" mt={4}>
        <Accordion.Root variant={"enclosed"} collapsible>
          {texts.map((text, index) => (
            <Accordion.Item key={index} value={text.text}>
              <Accordion.ItemTrigger>
                <Span flex="1">{text.text}</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody gap={4} display={"flex"} flexDir={"column"}>
                  {
                    // #region Szöveg méret
                  }
                  <Flex gap={4} width={"full"} alignItems={"center"}>
                    <Text w={"fit"}>Méret</Text>
                    <HStack flex="1">
                      <NumberInput.Root
                        onValueChange={(e) => {
                          setTextFontSize(text.id, e.valueAsNumber);
                        }}
                        value={(text.textStyles.fontSize ?? 0).toString()}
                        min={0}
                      >
                        <NumberInput.Control />
                        <NumberInput.Input />
                      </NumberInput.Root>

                      <Text fontSize="sm" color="gray.500">
                        px
                      </Text>
                    </HStack>
                  </Flex>
                  {
                    // #endregion
                  }
                  {
                    // #region Szöveg vastagság
                  }
                  <Flex gap={4} width="full" alignItems="center">
                    <Text w="fit">Vastagság</Text>
                    <Select.Root flex={"1"} collection={fontWeightCollection}>
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Válasszon" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {fontWeightCollection.items.map((item, index) => (
                              <Select.Item item={item.value} key={index}>
                                {item.label} ({item.value})
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </Flex>
                  {
                    // #endregion
                  }
                  {
                    // TODO: Mikor lesznek telepített fontfamily-k backenden akkor, ide jöhet a font family választó
                  }
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Stack>
    </Box>
  );
}
