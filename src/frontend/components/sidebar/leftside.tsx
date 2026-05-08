"use client";

import ColormodeSwitcher from "@/components/sidebar/colormodeswitch";
import LanguageSwitcher from "@/components/sidebar/languageswitch";
import { ProfileMenu } from "@/components/sidebar/profilemenu";
import { links, LinkType } from "@/config";
import { Avatar, Box, Flex, useSplitterContext } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import InfoPopover from "./infopopover";

export const LeftSide = ({ isDesktop }: { isDesktop: ReactNode }) => {
  const pathname = usePathname();
  const splitter = useSplitterContext();
  let collapsed = splitter.isPanelCollapsed("a");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true));

  return (
    <Flex
      p={0}
      justifyContent={"space-between"}
      flexDirection={"column"}
      w={"full"}
      h={"full"}
      gap={4}
    >
      {
        //#region Profilmenü
      }
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

              <Box
                hidden={Boolean(collapsed)}
                fontWeight="bold"
                textStyle="label"
                color="fg.default"
              >
                Bencso
              </Box>
            </Flex>
          </Flex>
        </ProfileMenu>

        {
          //#endregion
          //#region LINKEK implementálása
        }
        {isDesktop &&
          links.map((link: LinkType, index: number) => {
            return (
              <Link href={link.link || "/"} key={index}>
                <Box
                  p="4"
                  aria-current={
                    mounted && pathname === link.link ? "page" : undefined
                  }
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
            );
          })}
        {
          //#endregion
        }
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
        <InfoPopover />
        <ColormodeSwitcher />
        <LanguageSwitcher />
      </Flex>
    </Flex>
  );
};
