import { ExportImageBlockProp, ImageRadioProp } from "@/interfaces/export.interface";
import { useSessionStore } from "@/stores/sessionData";
import { RadioCard, HStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";



export const ExportImageBlock = (props: ExportImageBlockProp) => {
  let images = [
    ...useSessionStore((state) => state.sessionData),
  ] as ImageRadioProp[];

  if (images.length > 1)
    images.push({
      id: -1,
      title: "Összes kép",
    });

  return (
    <RadioCard.Root
      value={props.selected?.toString() ?? "-1"}
      onValueChange={(e) => props.setSelected(Number(e.value))}
      colorPalette={"teal"}
      variant={"outline"}
    >
      <HStack wrap="wrap" gap={4}>
        {images.sort((i)=> i.id).map((item: ImageRadioProp) => (
          <RadioCard.Item
            colorPalette={"white"}
            key={item.id}
            value={item.id.toString()}
            backgroundImage={
              item.blob
                ? props.selected === item.id
                  ? `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0,0,0,0.0)), url(${item.blob})`
                  : `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${item.blob})`
                : ""
            }
            bgSize="cover"
            bgPos="center"
            display={"flex"}
            flexDir={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius="md"
            w="120px"
            h="120px"
          >
            <RadioCard.ItemHiddenInput />

            {item.title && (
              <RadioCard.ItemText
                fontSize={"sm"}
                opacity={0.7}
                textAlign={"center"}
                w={"full"}
              >
                {item.title}
              </RadioCard.ItemText>
            )}
          </RadioCard.Item>
        ))}
      </HStack>
    </RadioCard.Root>
  );
};
