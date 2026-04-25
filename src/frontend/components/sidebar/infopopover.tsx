import {
  Box,
  Button,
  Clipboard,
  DataList,
  IconButton,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { LuHistory, LuInfo, LuUser } from "react-icons/lu";

//TODO: Ezt is ki lehetne tenni valami config fájlba
const stats = [
  { icon: <LuHistory />, label: "Verziószám", value: "0.01" },
  { icon: <LuUser />, label: "UID:", value: "30032211411UI" },
];

export default function InfoPopover() {
  const clipBoardValue = [
    "Debug infók:",
    ...stats.map(({ label, value }) => `${label} ${value}`),
  ].join("\n");

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton size="sm" variant="outline">
          <LuInfo />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title fontWeight="medium" mb={3}>
                Debug infók:
              </Popover.Title>
              <DataList.Root orientation="horizontal">
                {stats.map((item) => (
                  <DataList.Item key={item.label}>
                    <Box
                      color={"fg.muted"}
                      flexDirection={"row"}
                      gap={2}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      {item.icon}
                      <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                    </Box>
                    <DataList.ItemValue>{item.value}</DataList.ItemValue>
                  </DataList.Item>
                ))}
              </DataList.Root>
              <Box mt={4} display="flex" justifyContent="flex-end">
                <Clipboard.Root value={clipBoardValue}>
                  <Clipboard.Trigger asChild>
                    <Button size="xs" variant="subtle">
                      <Clipboard.Indicator />
                      Másolás
                    </Button>
                  </Clipboard.Trigger>
                </Clipboard.Root>
              </Box>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
