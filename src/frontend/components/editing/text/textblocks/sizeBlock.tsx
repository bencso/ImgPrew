import { minMaxValidation } from "@/helper/errorHelper";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Flex, HStack, NumberInput, Text } from "@chakra-ui/react";
import { shallow } from "zustand/shallow";

//#region Szöveg méret box
interface TextBlockSizeProps {
  id: string;
  fontSize: number;
}

export function TextBlockSize(props: TextBlockSizeProps) {
  const { selectedImg, imageScale, selectedScale } = useWorkSession();
  const { setTextFontSize } = useSessionStore();

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Text w="fit">Méret</Text>

      <HStack flex="1">
        <NumberInput.Root
          value={Math.round(
            (Number.isNaN(props.fontSize) ? 20 : (props.fontSize ?? 20)) *
              (selectedScale?.scale ?? 1),
          ).toString()}
          min={1}
          onValueChange={(e) =>
            setTextFontSize(
              selectedImg,
              props.id,
              minMaxValidation(e.valueAsNumber, 1, 200),
              (selectedScale?.scale??1),
            )
          }
        >
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
      </HStack>
    </Flex>
  );
}
//#endregion
