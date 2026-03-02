import {
    Box,
    CloseButton,
    Dialog,
    Menu,
    Portal,
    Stack, HStack, Text, Kbd
} from "@chakra-ui/react"
import { ReactNode, useState } from "react"
import {
    LuLogOut,
    LuMessageCircleQuestion,
    LuSettings,
} from "react-icons/lu"

export const ProfileMenu = ({ children }: { children: ReactNode }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false)

    return (
        <>
            <Menu.Root
                positioning={{
                    offset: { mainAxis: 1 },
                }}
            >
                <Menu.Trigger asChild>
                    {children}
                </Menu.Trigger>

                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="settings">
                                <LuSettings />
                                <Box flex="1">Beállítások</Box>
                            </Menu.Item>

                            <Menu.Item
                                value="helper"
                                onClick={() => setIsHelpOpen(true)}
                            >
                                <LuMessageCircleQuestion />
                                <Box flex="1">Súgó</Box>
                            </Menu.Item>

                            <Menu.Item
                                value="logout"
                                color="fg.error"
                                _hover={{ bg: "bg.error", color: "fg.error" }}
                            >
                                <LuLogOut />
                                <Box flex="1">Kijelentkezés</Box>
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
            {
                //#region DIALOG HELPER
            }
            <Dialog.Root
                open={isHelpOpen}
                onOpenChange={(e) => setIsHelpOpen(e.open)}
                size="cover"
                placement="center"
                motionPreset="slide-in-bottom"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Súgó</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Stack gap={4}>

                                    <HStack justify="space-between">
                                        <Text>Keresés megnyitása</Text>
                                        <HStack>
                                            <Kbd>Ctrl</Kbd>
                                            <Text>+</Text>
                                            <Kbd>K</Kbd>
                                        </HStack>
                                    </HStack>

                                    <HStack justify="space-between">
                                        <Text>Mentés</Text>
                                        <HStack>
                                            <Kbd>Ctrl</Kbd>
                                            <Text>+</Text>
                                            <Kbd>S</Kbd>
                                        </HStack>
                                    </HStack>

                                    <HStack justify="space-between">
                                        <Text>Új üzenet</Text>
                                        <HStack>
                                            <Kbd>Ctrl</Kbd>
                                            <Text>+</Text>
                                            <Kbd>N</Kbd>
                                        </HStack>
                                    </HStack>

                                    <HStack justify="space-between">
                                        <Text>Bezárás</Text>
                                        <Kbd>Esc</Kbd>
                                    </HStack>

                                </Stack>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}