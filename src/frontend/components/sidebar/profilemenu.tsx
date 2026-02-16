import { Box, Menu, Portal } from "@chakra-ui/react"
import { ReactNode } from "react"
import { LuLogOut, LuSettings } from "react-icons/lu"


export const ProfileMenu = ({ children }: { children: ReactNode }) => {
    return (
        <Menu.Root positioning={{
            offset: {
                mainAxis: 1
            }
        }}>
            <Menu.Trigger asChild>
                {children}
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner >
                    <Menu.Content>
                        <Menu.Item value="settings">
                            <LuSettings />
                            <Box flex="1">Beállítások</Box>
                        </Menu.Item>
                        <Menu.Item color="fg.error"
                            _hover={{ bg: "bg.error", color: "fg.error" }} value="logout">
                            <LuLogOut />
                            <Box flex="1">Kijelentkezés</Box>
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root >
    )
}
