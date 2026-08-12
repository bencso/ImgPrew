import { useWorkSession } from "@/providers/sessionprovider";
import {
  Box,
  Flex,
  HStack,
  Input,
  RadioCard,
  Slider,
  useSlider,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LuBrush, LuRotateCcw } from "react-icons/lu";

export default function MaskBlock() {
  const {
    maskBrushSize,
    maskErase,
    setMaskBrushSize,
    setMaskEraseMode,
    maskSharpness,
    setMaskSharpness,
  } = useWorkSession();

  const items = [
    { value: "normal", title: "Draw" },
    { value: "erase", title: "Erase" },
  ];

  return (
    <Box>
      <VStack gap={2}>
        <RadioCard.Root
          w={"full"}
          defaultValue={"normal"}
          value={maskErase ? "erase" : "normal"}
          onChange={(e: any) => {
            const value = e.target.value ?? "normal";
            setMaskEraseMode(value === "erase");
          }}
        >
          {items.map((item) => (
            <RadioCard.Item key={item.value} value={item.value}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                <RadioCard.ItemIndicator />
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </RadioCard.Root>
        <Slider.Root
          onValueChange={(e) => {
            const itemValue = e.value[0];
            setMaskBrushSize(itemValue);
          }}
          value={[maskBrushSize]}
          thumbAlignment="center"
          min={0}
          max={30}
          step={1}
          minW="200px"
          w={"full"}
          flex="1"
          px={2}
          boxSizing={"border-box"}
        >
          <Box
            alignItems={"center"}
            justifyContent={"space-between"}
            display={"flex"}
            flexDirection={"row"}
          >
            <Slider.Label>Ecset mérete</Slider.Label>
            <Flex gap={2} alignItems={"center"}>
              <Slider.ValueText color={"fg.muted"}>
                {Number(maskBrushSize)}
              </Slider.ValueText>
            </Flex>
          </Box>
          <Slider.Control mt={2}>
            <Slider.Track>
              <Slider.Range bg={"transparent"} />
            </Slider.Track>
            <Slider.Thumb
              index={0}
              boxSize={6}
              borderColor="teal.500"
              rounded={"l3"}
            />
          </Slider.Control>
        </Slider.Root>
        <Slider.Root
          onValueChange={(e) => {
            const itemValue = Math.min(Math.max(1 - e.value[0], 0), 1);
            setMaskSharpness(itemValue);
          }}
          value={[1 - maskSharpness]}
          thumbAlignment="center"
          min={0}
          max={1}
          step={0.1}
          minW="200px"
          w={"full"}
          flex="1"
          px={2}
          boxSizing={"border-box"}
        >
          <Box
            alignItems={"center"}
            justifyContent={"space-between"}
            display={"flex"}
            flexDirection={"row"}
          >
            <Slider.Label>Ecset átmente</Slider.Label>
            <Flex gap={2} alignItems={"center"}>
              <Slider.ValueText color={"fg.muted"}>
                {Math.round(Number(maskSharpness * 10))}
              </Slider.ValueText>
            </Flex>
          </Box>
          <Slider.Control mt={2}>
            <Slider.Track>
              <Slider.Range bg={"transparent"} />
            </Slider.Track>
            <Slider.Thumb
              index={0}
              boxSize={6}
              borderColor="teal.500"
              rounded={"l3"}
            />
          </Slider.Control>
        </Slider.Root>
      </VStack>
    </Box>
  );
}
