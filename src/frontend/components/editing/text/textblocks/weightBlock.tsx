import { appFonts } from "@/interfaces/appFonts.interface";
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

interface TextBlockWeightProps {
  id: string;
  fontWeight: number;
  fontFamily: string;
}

export function TextBlockWeight(props: TextBlockWeightProps) {
  const { selectedImg } = useWorkSession();
  const { setTextFontWeight } = useSessionStore();
  const activeFamilyWeights = 
    appFonts
      .find((item) => item.id.toLowerCase() === (props.fontFamily ?? "roboto").toLowerCase())
      ?.weights as any[]
  ;

  const fontWeightCollection = createListCollection({
    items: activeFamilyWeights
  });

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Text w="fit">Vastagság</Text>

      <Select.Root
        flex="1"
        collection={fontWeightCollection}
        value={[props.fontWeight?.toString() ?? "400"]}
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
              {fontWeightCollection.items.map((item, index) => (
                <Select.Item key={index} item={item}>
                  {item}
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
