import { useWorkSession } from "@/providers/sessionprovider";
import { Box, Flex, HStack, Input, RadioCard, VStack } from "@chakra-ui/react";

export default function MaskBlock() {
  const {
    maskBrushSize,
    maskErase,
    setMaskBrushSize,
    setMaskEraseMode,
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
          placeholder="Masz ecset méret"
          value={maskBrushSize}
          onChange={(e) => {
            console.log(e.target.value);
            setMaskBrushSize(Number(e.target.value));
          }}
          variant="outline"
        />
      </VStack>
    </Box>
  );
}
