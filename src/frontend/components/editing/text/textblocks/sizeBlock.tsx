import { minMaxValidation } from "@/helper/errorHelper";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Flex, HStack, NumberInput, Text } from "@chakra-ui/react";

//#region Szöveg méret box
interface TextBlockSizeProps {
  id: string;
  fontSize: number;
}

export function TextBlockSize(props: TextBlockSizeProps) {
  const { selectedImg } = useWorkSession();
  const { setTextFontSize } = useSessionStore();

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Text w="fit">Méret</Text>

      <HStack flex="1">
        <NumberInput.Root
          value={(minMaxValidation(props.fontSize, 0, 180) || 20).toString()}
          min={0}
          max={180}
          onValueChange={(e) =>
            setTextFontSize(
              selectedImg,
              props.id,
              minMaxValidation(e.valueAsNumber, 0, 180),
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
