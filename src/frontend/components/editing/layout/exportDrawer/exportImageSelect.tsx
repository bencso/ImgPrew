import { Flex, ScrollArea, Box } from "@chakra-ui/react"

const ExportImageBlock = () => (
  <ScrollArea.Root width="24rem" size="xs">
    <ScrollArea.Viewport>
      <ScrollArea.Content py="4">
        <Flex gap="4" flexWrap="nowrap">
          {Array.from({ length: 12 }, (_, i) => (
            <Box rounded="sm" key={i} h="20" w="40" flexShrink="0">
              Item {i + 1}
            </Box>
          ))}
        </Flex>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="horizontal" />
    <ScrollArea.Corner />
  </ScrollArea.Root>
)
