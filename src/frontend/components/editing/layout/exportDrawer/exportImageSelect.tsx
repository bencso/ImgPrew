import { useSessionStore } from "@/stores/sessionData";
import { RadioCard, HStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface ExportImageBlockProp {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}
export const ExportImageBlock = (props: ExportImageBlockProp) => {
  const images = useSessionStore((state) => state.sessionData);

  return (
    <RadioCard.Root
      value={props.selected?.toString() ?? "0"}
      onValueChange={(e) => props.setSelected(Number(e.value))}
      colorPalette={"teal"}
      variant={"outline"}
    >
      <HStack wrap="wrap" gap={4}>
        {images.map((item) => (
          <RadioCard.Item
            colorPalette={"white"}
            key={item.id}
            value={item.id.toString()}
            backgroundImage={`${props.selected === item.id ? "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0,0,0,0.0))" : "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))"}, url(${item.blob})`}
            bgSize="cover"
            bgPos="center"
            borderRadius="md"
            w="120px"
            h="120px"
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl/>
          </RadioCard.Item>
        ))}
      </HStack>
    </RadioCard.Root>
  );
};
