import { ImageItem } from "@/interfaces/gallery.interface";
import { Grid, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import moment from "moment";

export function ImageList({
  imgs,
  selectedId,
  onSelect,
}: {
  imgs: ImageItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  return (
    <Box>
      {imgs.map((img, i) => {
        const id = img.img + i;

        return (
          <Grid
            key={id}
            py={2}
            px={2}
            borderBottom={"1px solid"}
            borderBlockColor={"teal"}
            templateColumns={isLg ? "repeat(3,1fr)" : "repeat(2,1fr)"}
            bg={selectedId === img.id ? "teal/30" : "bg"}
            onClick={() => onSelect(img.id)}
            _hover={{
              bg: selectedId === img.id ? "teal/80" : "teal.800",
            }}
          >
            <GridItem paddingEnd={isLg ? 8 : 4}>
              <Text fontSize={"md"} lineClamp={1}>
                {img.text || "Ismeretlen"}
              </Text>
            </GridItem>
            {isLg && (
              <GridItem paddingEnd={isLg ? 8 : 4}>
                <Text fontSize={"md"} lineClamp={1}>
                  {moment(img.date).fromNow() || "Ismeretlen"}
                </Text>
              </GridItem>
            )}
            <GridItem paddingEnd={isLg ? 0 : 4}>
              <Text textAlign={"right"} lineClamp={1} fontSize={"md"}>
                {img.location || "Ismeretlen"}
              </Text>
            </GridItem>
          </Grid>
        );
      })}
    </Box>
  );
}
