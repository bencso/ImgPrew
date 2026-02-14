import { EditItemProp, InputTypes } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { Box, Checkbox, Field, Input, Popover, Portal, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
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
    const { editFunction } = useWorkSession();
    const { ws } = useWebsocket();
    const handleChange = (name: string, value: any) => {
        editFunction(ws, items.function, name, value)
    }

    return (
        <Stack gap="4">
            {
                items.inputs && items.inputs.map((item, index) => {
                    switch (item.inputType) {
                        case InputTypes.CHECKBOX:
                            return (
                                <Box key={index} display={"flex"} flexDirection={"column"}>
                                    <Text marginBottom={2}>{item.name}</Text>
                                    <Box display={"flex"} flexDirection={"column"} gap={2}>
                                        {item.options?.map((option, optionI) => {
                                            return (<Checkbox.Root onChange={(event) => {
                                                handleChange(item.name, {[option]: event.target.hasAttribute("checked")} );
                                            }} key={optionI} variant="outline" colorPalette="gray">
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                <Checkbox.Label>{option}</Checkbox.Label>
                                            </Checkbox.Root>)
                                        })}
                                    </Box>
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