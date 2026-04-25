import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  ColorPicker,
  Flex,
  HStack,
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
  const { setTextColor } = useSessionStore();

  return (
    <Flex gap={4} width="full" alignItems="center">
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
    </Flex>
  );
}
