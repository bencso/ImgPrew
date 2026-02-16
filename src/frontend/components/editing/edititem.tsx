import { EditItemProp, InputTypes } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { Box, Checkbox, createListCollection, Field, Input, Popover, Portal, Select, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";

const activeStyle =
{
    borderLeftColor: "teal.fg",
    bg: "bg.emphasized",
    color: "fg.default",
    "& svg": { color: "teal.fg" },
}

export const EditItem = ({ items }: { items: EditItemProp }) => {
    const isMd = useBreakpointValue(
        { base: false, sm: false, md: false, lg: true, xl: true },
        { ssr: false, }
    );

    const [open, setOpen] = useState(false);

    return (
        <Popover.Root open={open}
            onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: isMd ? "left" : "top-start" }}>
            <Popover.Trigger asChild>
                <Box
                    p="4"
                    display={"flex"}
                    borderBottomWidth={isMd ? "1px" : "0"}
                    borderTopWidth={isMd ? "0" : "2px"}
                    borderColor="border.disabled"
                    textDecoration={"none"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={"full"}
                    gap={4}
                    w={"full"}
                    borderRightWidth="2px"
                    borderLeftColor={"border.disabled"}
                    borderRadius={0}
                    color="fg.muted"
                    _hover={{ bg: "bg.muted" }}
                    _focusVisible={activeStyle}
                    _active={activeStyle}
                    tabIndex={0}
                    {...(open && activeStyle)}
                    as={"button"}
                >
                    {
                        items.icon && items.icon
                    }
                    {
                        !items.icon && items.function.substring(0, 3)
                    }
                </Box>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body>
                            <Item items={items} />
                        </Popover.Body>
                        <Popover.CloseTrigger />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

const Item = ({ items }: { items: EditItemProp }) => {
    const { editFunction, selectedImg } = useWorkSession();
    const { ws } = useWebsocket();
    const handleChange = (name: string, value: any) => {
        editFunction(ws, selectedImg, items.function, name, value)
    }



    return (
        <Stack gap="4">
            {
                items.inputs && items.inputs.map((item, index) => {
                    const collection = createListCollection({
                        items: item.options ?? []
                    });

                    switch (item.inputType) {
                        case InputTypes.select:
                            return (
                                <Box key={index} display={"flex"} flexDirection={"column"}>
                                    <Text marginBottom={4}>{item.name}</Text>
                                    <Select.Root multiple collection={collection} size="sm" >
                                        <Select.HiddenSelect />
                                        <Select.Label>Válassza ki a kivánt exif adatokat</Select.Label>
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder="Select framework" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {item.options?.map((option) => (
                                                        <Select.Item item={option} key={option}>
                                                            {option}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </Box>
                            )
                        default:
                            return (
                                <Field.Root key={index}>
                                    <Field.Label>{item.name}</Field.Label>
                                    <Input onChange={(event) => handleChange(item.name, event.target.value)} type={item.inputType} placeholder="40px" />
                                </Field.Root>
                            )
                    }
                })
            }
        </Stack>
    )
}