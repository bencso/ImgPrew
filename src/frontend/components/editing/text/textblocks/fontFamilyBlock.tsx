import { appFonts } from "@/helper/appFonts";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { useMemo } from "react";
import {
  createListCollection,
  Flex,
  Portal,
  Select,
  Text,
} from "@chakra-ui/react";

interface TextBlockFamilyProps {
  id: string;
  fontFamily: string;
}

export function TextBlockFamily(props: TextBlockFamilyProps) {
  const { selectedImg } = useWorkSession();
  const { setTextFontFamily } = useSessionStore();

  const fontFamilyCollection = useMemo(() => {
    return createListCollection({
      items: appFonts,
      itemToValue: (item) => item.id,
      itemToString: (item) => item.name,
    });
  }, []);

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Text w="fit">Betűtípus</Text>

      <Select.Root
        flex="1"
        collection={fontFamilyCollection}
        value={[props.fontFamily?.toString().toLowerCase() ?? "roboto"]}
        onValueChange={(e) => {
          setTextFontFamily(selectedImg, props.id, e.value[0]);
        }}
      >
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Válasszon betűtípust" />
          </Select.Trigger>

          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {fontFamilyCollection.items.map((item) => (
                <Select.Item key={item.id} item={item}>
                  {item.name}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Flex>
  );
}
