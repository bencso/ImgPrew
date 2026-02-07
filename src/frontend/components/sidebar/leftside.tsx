"use client";

import {
    Avatar,
    Box,
    Flex,
    LinkBox,
    useSplitterContext,
} from "@chakra-ui/react";
import ColormodeSwitcher from "../sidebar/colormodeswitch";
import { ReactNode, useEffect, useState } from "react";
import { LuGalleryThumbnails, LuHouse } from "react-icons/lu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "./languageswitch";
import { ProfileMenu } from "./profilemenu";

interface Link {
    name?: string;
    link?: string;
    icon?: ReactNode;
}

export const LeftSide = ({ isDesktop }: { isDesktop: ReactNode }) => {
    const pathname = usePathname();
    const splitter = useSplitterContext();
    let collapsed = splitter.isPanelCollapsed("a");
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true));

    const links: Link[] = [
        {
            name: "Főoldal",
            link: "/",
            icon: <LuHouse size={22} />
        },
        {
            name: "Létrehozás",
            link: "/create",
            icon: <LuGalleryThumbnails size={22} />
        }
    ]

    return (
        <Flex
            p={0}
            justifyContent={"space-between"}
            flexDirection={"column"}
            w={"full"}
            h={"full"}
            gap={4}
        >
            <Box>
                <ProfileMenu>
                    <Flex
                        cursor={"pointer"}
                        p="4"
                        borderBottomWidth={"1px"}
                        borderColor="border.disabled"
                        borderRadius={0}
                        color="fg.disabled"
                        backgroundColor="bg.subtle"
                        justifyContent={collapsed ? "center" : "start"}
                        alignItems={"center"}
                        _hover={{ bg: "bg.muted" }}
                    >
                        <Flex gap={2} alignItems={"center"}>
                            <Avatar.Root>
                                <Avatar.Fallback name="Shane Nelson" />
                            </Avatar.Root>

                            <Box hidden={Boolean(collapsed)} fontWeight="bold" textStyle="label" color="fg.default">
                                Bencso
                            </Box>
                        </Flex>
                    </Flex>
                </ProfileMenu>

                {/*#region LINKS*/}
                {
                    isDesktop &&
                    links.map((link, index) => {
                        return <Link href={link.link || "/"} key={index}><Box
                            p="4"
                            aria-current={mounted && pathname === link.link ? "page" : undefined}
                            display={"flex"}
                            borderBottomWidth={"1px"}
                            borderColor="border.disabled"
                            textDecoration={"none"}
                            justifyContent={collapsed ? "center" : "start"}
                            alignItems={"center"}
                            flexDirection={collapsed ? "column" : "row"}
                            gap={4}
                            borderLeftWidth="2px"
                            borderLeftColor={"border.disabled"}
                            borderRadius={0}
                            color="fg.muted"
                            _hover={{ bg: "bg.muted" }}
                            _currentPage={{
                                borderLeftColor: "teal.fg",
                                bg: "bg.emphasized",
                                color: "fg.default",
                                "& svg": { color: "teal.fg" },
                            }}
                        >
                            {link.icon}
                            {!collapsed && <Box fontSize={"sm"}>{link.name}</Box>}
                        </Box>
                        </Link>
                    })
                }
                {/*#endregion LINKS*/}
            </Box>
            <Flex
                p="4"
                borderTopWidth="1px"
                hidden={!isDesktop}
                borderColor="border.disabled"
                color="fg.disabled"
                justifyContent={collapsed ? "center" : "start"}
                alignItems={"center"}
                flexDirection={collapsed ? "column" : "row"}
                gap={4}
            >
                <ColormodeSwitcher />
                <LanguageSwitcher />
            </Flex>
        </Flex>
    );
};
