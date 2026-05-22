import { useSessionStore } from "@/stores/sessionData";
import {
  Grid,
  GridItem,
  HStack,
  Icon,
  RadioCard,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  BsFiletypeJpg,
  BsFiletypePng,
  BsFiletypeBmp,
  BsFiletypeGif,
  BsFiletypeTiff,
  BsFileEarmark,
} from "react-icons/bs";

interface ExportFileExtensionProp {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

export const ExportFileExtension = (props: ExportFileExtensionProp) => {
  const { setExportFileExtension, setExportAllFileExtension } =
    useSessionStore();

  return (
    <RadioCard.Root
      orientation="horizontal"
      align="center"
      justify="center"
      defaultValue="jpg"
      variant={"surface"}
      colorPalette={"teal"}
      onValueChange={(e) => {
        const type = e.value;
        if (type)
          if (props.selected !== -1)
            setExportFileExtension(props.selected, type);
          else setExportAllFileExtension(type);
      }}
    >
      <Text textTransform={"uppercase"} fontSize={"xs"} fontWeight={"bold"}>
        Fájlkiterjesztés
      </Text>
      <Grid templateColumns={"repeat(4, 1fr)"} gap={3} w={"full"}>
        {items.map((item, index) => (
          <GridItem w={"full"} key={index}>
            <RadioCard.Item key={item.value} value={item.value}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <Icon fontSize="2xl" color="fg.subtle">
                  {item.icon}
                </Icon>
                <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
              </RadioCard.ItemControl>
            </RadioCard.Item>
          </GridItem>
        ))}
      </Grid>
    </RadioCard.Root>
  );
};

const items = [
  { value: "jpg", title: "JPG", icon: <BsFiletypeJpg /> },
  { value: "png", title: "PNG", icon: <BsFiletypePng /> },
  { value: "bmp", title: "BMP", icon: <BsFiletypeBmp /> },
  { value: "webp", title: "WebP", icon: <BsFileEarmark /> },
  { value: "gif", title: "GIF", icon: <BsFiletypeGif /> },
  { value: "tiff", title: "TIFF", icon: <BsFiletypeTiff /> },
];
