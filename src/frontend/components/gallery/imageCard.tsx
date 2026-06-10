import { ImageItem } from "@/interfaces/gallery.interface";
import { Box, Image } from "@chakra-ui/react";

export function ImageCard({
  img,
  isSelected,
  onClick,
}: {
  img: ImageItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      borderRadius="md"
      cursor="pointer"
      overflow="hidden"
      position="relative"
      userSelect={"none"}
      onClick={onClick}
      mb="8px"
    >
      <Image src={img.img} alt={img.text} w="100%" borderRadius="md" />
      {isSelected && (
        <Box
          position="absolute"
          inset={0}
          bgGradient="to-t"
          gradientFrom="teal.400"
          opacity={0.7}
          gradientTo="transparent"
        />
      )}
    </Box>
  );
}
