import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  createListCollection,
  Flex,
  Portal,
  Select,
  Text,
} from "@chakra-ui/react";

//#region Szöveg vastagság box
const fontWeightCollection = createListCollection({
  items: [
    { label: "Thin", value: "100" },
    { label: "Extra Light", value: "200" },
    { label: "Light", value: "300" },
    { label: "Normal", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semi Bold", value: "600" },
    { label: "Bold", value: "700" },
    { label: "Extra Bold", value: "800" },
    { label: "Black", value: "900" },
  ],
});

interface TextBlockWeightProps {
  id: string;
  fontWeight: number;
}

export function TextBlockWeight(props: TextBlockWeightProps) {
  const { selectedImg } = useWorkSession();
  const { setTextFontWeight } = useSessionStore();

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Text w="fit">Vastagság</Text>

      <Select.Root
        flex="1"
        collection={fontWeightCollection}
        value={[props.fontWeight?.toString() ?? "500"]}
        onValueChange={(e) =>
          setTextFontWeight(selectedImg, props.id, Number(e.value[0]))
        }
      >
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Válasszon" />
          </Select.Trigger>

          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {fontWeightCollection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label} ({item.value})
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

//#endregion
