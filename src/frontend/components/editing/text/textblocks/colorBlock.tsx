import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  ColorPicker,
  Flex,
  HStack,
  NumberInput,
  parseColor,
  Portal,
  Text,
} from "@chakra-ui/react";

interface TextBlockColorProps {
  id: string;
  color: string;
}

export function TextBlockColor(props: TextBlockColorProps) {
  const { selectedImg } = useWorkSession();
  const { setTextColor, setTextOpacity } = useSessionStore();

  const texts = useSessionStore((i) =>
    i.sessionData.find((s) => s.id === selectedImg),
  )?.texts?.find((t) => t.id === props.id);

  return (
    <Flex gap={4} width="full" flexDir={"column"} alignItems="center">
      <Text w="fit">Szín</Text>
      <ColorPicker.Root
        onValueChange={(details) => {
          setTextColor(selectedImg, props.id, details.value.toString("hex"));
        }}
        w={"full"}
        value={parseColor(props.color)}
      >
        <ColorPicker.HiddenInput />
        <ColorPicker.Control>
          <ColorPicker.Input />
          <ColorPicker.Trigger />
        </ColorPicker.Control>
        <Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Content>
              <ColorPicker.Area />
              <HStack>
                <ColorPicker.EyeDropper size="xs" variant="outline" />
                <ColorPicker.Sliders />
              </HStack>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
      </ColorPicker.Root>
      <Text w="fit" mt={4}>
        Áttettszőség
      </Text>
      <HStack flex="1">
        <NumberInput.Root
          value={((texts?.opacity ?? 1) * 100).toString() ?? "100"}
          min={0}
          max={100}
          w={"full"}
          onValueChange={(e) => {
            setTextOpacity(selectedImg, props.id, e.valueAsNumber);
          }}
        >
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
        <Text>%</Text>
      </HStack>
    </Flex>
  );
}
