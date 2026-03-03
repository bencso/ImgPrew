import { EditItemProp, InputTypes } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { Box, Button, createListCollection, Field, Grid, GridItem, HStack, Input, Popover, Portal, RadioCard, Select, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import ImageIcon from "../icons/imageIcon";
import { useSessionStore } from "@/stores/sessionData";

const activeStyle =
{
    borderLeftColor: "teal.fg",
    bg: "bg.emphasized",
    color: "fg.default",
    "& svg": { color: "teal.fg" },
}

//#region SIDEBAR ITEM
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


//#region SIDEBAR ITEM Optionjei
const Item = ({ items }: { items: EditItemProp }) => {
    //#region contextek, és egyéb függőségek
    const { editFunction, selectedImg } = useWorkSession();
    const { ws, sendMessage } = useWebsocket();
    const handleChange = (name: string, value: any) => {
        editFunction(ws, selectedImg, items.function, name, value)
    }
    //#endregion


    return (
        <Stack gap="4">
            {
                items.inputs && items.inputs.map((item, index) => {
                    const collection = createListCollection({
                        items: ((item.options instanceof Array) && item.options) ? item.options : []
                    });
                    //#region INPUT kezelés, és eldöntés (switch case)
                    switch (item.inputType) {
                        //#region select type
                        case InputTypes.select:
                            return (
                                <Box key={index} display={"flex"} flexDirection={"column"}>
                                    {item.name.length > 0 && <Text marginBottom={4}>{item.name}</Text>}
                                    <Select.Root multiple collection={collection} size="sm" >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder="Válasszon..." />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {(item.options instanceof Array) && item.options?.map((option) => (
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
                        //#region customElement type
                        case InputTypes.customElement:
                            return (
                                <Box key={index} display={"flex"} flexDirection={"column"}>
                                    {item.name.length > 0 && <Text marginBottom={4}>{item.name}</Text>}
                                    {React.isValidElement(item.options) && <Fragment>{item.options}</Fragment>}
                                </Box>
                            )
                        //#region elküldés
                        case "submit":
                            return (
                                <Button key={index} onClick={item.onChange ? item.onChange : (e) => {
                                    sendMessage({
                                        message: item.name
                                    })
                                }}>
                                    {item.name}
                                </Button>
                            )
                        //#region radio type
                        case "radio":
                            return (
                                <Box key={index} display={"flex"} flexDirection={"column"}>
                                    <RadioCard.Root
                                        orientation="vertical"
                                        align="center"
                                        maxW="400px"
                                        defaultValue={item.defaultValue ? item.defaultValue : item.options instanceof Array && item.options[0]}
                                        variant={"subtle"}
                                    >
                                        <RadioCard.Label>
                                            {item.name.length > 0 && item.name}
                                        </RadioCard.Label>
                                        <HStack w={"full"} flexWrap={"wrap"}>
                                            {(item.options && item.options instanceof Array) && item.options.map((option, index) => {
                                                return (
                                                    <RadioCard.Item key={index} value={option} onChange={item.onChange || undefined} colorPalette={"teal"}>
                                                        <RadioCard.ItemHiddenInput />
                                                        <RadioCard.ItemControl>
                                                            <ImageIcon icon={option} />
                                                            <RadioCard.ItemText fontSize={"sm"} color={"fg.muted"}> {option}</RadioCard.ItemText>
                                                        </RadioCard.ItemControl>
                                                    </RadioCard.Item>
                                                )
                                            })}
                                        </HStack>
                                    </RadioCard.Root>
                                </Box>
                            )
                        //#region egyéb / minden nem egyedi type
                        default:
                            return (
                                <Field.Root key={index}>
                                    {item.name.length > 0 && <Field.Label>{item.name}</Field.Label>}
                                    <Input onChange={(event) => handleChange(item.name, event.target.value)} type={item.inputType} placeholder="40px" />
                                </Field.Root>
                            )
                    }
                })
            }
        </Stack>
    )
}