import {
    Box,
    CloseButton,
    Dialog,
    Menu,
    Portal,
    HStack,
    Text,
    Kbd,
    Grid,
    GridItem
} from "@chakra-ui/react"
import { ReactNode, useState } from "react"
import {
    LuLogOut,
    LuMessageCircleQuestion,
    LuSettings,
} from "react-icons/lu"


const shortCuts = [{
    name: "Általános",
    items: [
        {
            name: "Előző kép",
            keyboardShortcut: "←",
        },
        {
            name: "Következő kép",
            keyboardShortcut: "→",
        }
    ]
},
{
    name: "Képszerkesztő",
    items: [
        {
            name: "Újrakezdés",
            keyboardShortcut: "R",
        }
    ]
},
]

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
                                <Grid gap={12} templateColumns="repeat(2, 1fr)">
                                    {
                                        shortCuts.map((group, index) => {
                                            return (
                                                <GridItem key={index} gap={6} display={"flex"} flexDirection={"column"}>
                                                    <Text fontSize={"xl"} mb={6} fontWeight={"bold"}>{group.name}</Text>

                                                    {group.items.map((shortcut) => {
                                                        return <HStack justify="space-between">
                                                            <Text>{shortcut.name}</Text>
                                                            <HStack>
                                                                {
                                                                    shortcut.keyboardShortcut.split(" ").map((item) => {
                                                                        return (
                                                                            <Kbd>{item}</Kbd>
                                                                        )
                                                                    })
                                                                }
                                                            </HStack>
                                                        </HStack>
                                                    })}

                                                </GridItem>
                                            )
                                        })
                                    }
                                </Grid>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    )
}