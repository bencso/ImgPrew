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
import { useState } from "react";
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
  const { addTexts, setTextFontSize, setTextFontWeight } = useSessionStore();
  const texts = useSessionStore((s) => s.getTexts(selectedImg));

  const [text, setText] = useState("");

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
            if (!text) return;
            addTexts(selectedImg, text);
            setText("");
          }}
        >
          Hozzáadás
        </Button>
      </Flex>

      <Stack gap="2" mt={4}>
        <Accordion.Root variant="enclosed" collapsible>
          {texts.map((text) => (
            <Accordion.Item key={text.id} value={text.id.toString() || ""}>
              <Accordion.ItemTrigger>
                <Span flex="1">{text.text}</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody gap={4} display="flex" flexDir="column">
                  {/* Szöveg méret */}
                  <Flex gap={4} width="full" alignItems="center">
                    <Text w="fit">Méret</Text>

                    <HStack flex="1">
                      <NumberInput.Root
                        value={(text.fontSize || 20).toString()}
                        min={0}
                        onValueChange={(e) =>
                          setTextFontSize(selectedImg, text.id, e.valueAsNumber)
                        }
                      >
                        <NumberInput.Control />
                        <NumberInput.Input />
                      </NumberInput.Root>

                      <Text fontSize="sm" color="gray.500">
                        px
                      </Text>
                    </HStack>
                  </Flex>

                  {/* Szöveg vastagság */}
                  <Flex gap={4} width="full" alignItems="center">
                    <Text w="fit">Vastagság</Text>

                    <Select.Root
                      flex="1"
                      collection={fontWeightCollection}
                      value={[text.fontWeight?.toString() ?? "500"]}
                      onValueChange={(e) =>
                        setTextFontWeight(
                          selectedImg,
                          text.id,
                          Number(e.value[0]),
                        )
                      }
                    >
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
                            {fontWeightCollection.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label} ({item.value})
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </Flex>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Stack>
    </Box>
  );
}
