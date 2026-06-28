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

  const slider = useSlider({
    defaultValue: [maskSharpness],
    thumbAlignment: "center",
    min: 0,
    max: 1,
    step: 0.1,
  });

  useEffect(() => {
    const itemValue = Math.min(Math.max(1 - slider.value[0], 0), 1);    
    setMaskSharpness(itemValue);
  }, [slider]);

  return (
    <Box>
      <VStack gap={2}>
        <RadioCard.Root
          w={"full"}
          defaultValue={maskErase ? "erase" : "normal"}
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
        <Input
          placeholder="Maszk ecset méret"
          value={maskBrushSize}
          onChange={(e) => {
            setMaskBrushSize(Number(e.target.value));
          }}
          variant="outline"
        />
        <Slider.RootProvider value={slider} w={"full"}>
          <Slider.Label>Maszk ecset lágyság</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.RootProvider>
      </VStack>
    </Box>
  );
}
