import { Box, Field, Icon, Input, Popover, Portal, Stack, useBreakpoint, useBreakpointValue, useMediaQuery } from "@chakra-ui/react";
import { HTMLInputTypeAttribute, ReactNode, useEffect, useRef, useState } from "react";

export enum InputTypes {
    CHECKBOX = "checkbox"
}

interface FunctionProp {
    name: string;
    inputType: InputTypes | HTMLInputTypeAttribute;
    options?: any[];
}

export interface EditItemProp {
    function: string;
    icon?: ReactNode;
    inputs?: FunctionProp[];
}

const activeStyle =
{
    borderLeftColor: "teal.fg",
    bg: "bg.emphasized",
    color: "fg.default",
    "& svg": { color: "teal.fg" },
}



//TODO: REDUX TELEPÍTÉSE ÉS AZZOL MEGOLDANI A STATE MANAGMENTET
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
                            <Stack gap="4">
                                {
                                    items.inputs && items.inputs.map((item, index) => {
                                        switch (item.inputType) {

                                            case InputTypes.CHECKBOX:
                                                return (
                                                    <Field.Root key={index}>
                                                        <Field.Label>{item.name}</Field.Label>
                                                    </Field.Root>
                                                )
                                            default:
                                                return (
                                                    <Field.Root key={index}>
                                                        <Field.Label>{item.name}</Field.Label>
                                                        <Input type={item.inputType} placeholder="40px" />
                                                    </Field.Root>
                                                )
                                        }
                                    })
                                }
                            </Stack>
                        </Popover.Body>
                        <Popover.CloseTrigger />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}