import { useWorkSession } from "@/providers/sessionprovider";

import { Box, createListCollection, Portal, Select } from "@chakra-ui/react";

const channels = createListCollection({
  items: [
    {
      label: "Piros",
      value: "red",
    },
    {
      label: "Zöld",
      value: "green",
    },
    {
      label: "Kék",
      value: "blue",
    },
  ],
});

export default function ChannelMixerBlock() {
  const { selectedChannel, setSelectedChannel } = useWorkSession();

  return (
    <>
      <Select.Root
        collection={channels}
        size="sm"
        width="100%"
        value={[selectedChannel ?? "red"]}
        onValueChange={(e) => {
          setSelectedChannel(e.value[0]);
        }}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger display={"flex"} gap={4} flexDir={"row"} justifyContent={"left"}>
              <Box h={2} w={2} rounded={"full"} backgroundColor={`${selectedChannel}.400`} />
            <Select.ValueText placeholder="Válasszon színcsatornát" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {channels.items.map((channel) => (
                <Select.Item item={channel} key={channel.value}>
                  {channel.label}
                  <Select.ItemIndicator color={`${channel.value}.400`} />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      {
        // ----
      }
    </>
  );
}
