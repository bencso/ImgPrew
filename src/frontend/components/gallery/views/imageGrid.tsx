import { ImageItem } from "@/interfaces/gallery.interface";
import { Box } from "@chakra-ui/react";
import { ImageCard } from "../imageCard";

export function ImageGrid({
  imgs,
  selectedId,
  onSelect,
}: {
  imgs: ImageItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <Box
      css={{
        columnGap: "8px",
        columnCount: { base: 1, sm: 2, md: 3 },
      }}
    >
      {imgs.map((img, i) => {
        const id = img.img + i;

        return (
          <ImageCard
            key={id}
            img={img}
            isSelected={selectedId === img.id}
            onClick={() => onSelect(img.id)}
          />
        );
      })}
    </Box>
  );
}