import { appInfos } from "@/config";
import {
  Box,
  Button,
  Clipboard,
  DataList,
  IconButton,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";

export default function InfoPopover() {
  const clipBoardValue = [
    "Debug infók:",
    ...appInfos.map(
      ({ label, value }: { label: string; value: string }) =>
        `${label} ${value}`,
    ),
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
                {appInfos.map((item) => (
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
