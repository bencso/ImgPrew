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
  const { selectedImg, textAndImagePlaceRef, selectedScale } = useWorkSession();
  const { setTextFontSize } = useSessionStore();

  const imageScale = Math.min(
    (textAndImagePlaceRef.current?.clientHeight ?? 0) /
      (selectedScale?.image.height ?? 1),
    (textAndImagePlaceRef.current?.clientWidth ?? 0) /
      (selectedScale?.image.height ?? 1),
  );

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Text w="fit">Méret</Text>

      <HStack flex="1">
        <NumberInput.Root
          value={((props.fontSize ?? 20) * imageScale).toString()}
          min={20}
          onValueChange={(e) =>
            setTextFontSize(
              selectedImg,
              props.id,
              minMaxValidation(e.valueAsNumber / imageScale, 20),
            )
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
  );
}
//#endregion
