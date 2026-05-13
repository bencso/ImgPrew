"use client";

import ColormodeSwitcher from "@/components/sidebar/colormodeswitch";
import LanguageSwitcher from "@/components/sidebar/languageswitch";
import { ProfileMenu } from "@/components/sidebar/profilemenu";
import { links, LinkType } from "@/config";
import { Avatar, Box, Flex, IconButton, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InfoPopover from "./infopopover";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

export const LeftSide = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true));
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //TODO: Ezt majd kitenni, hogy cookieba tárolja és onnan beolvasni
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Flex
      p={0}
      justifyContent={"space-between"}
      flexDirection={"column"}
      w={isMd ? collapsed ?  "20" : "50" : "full"}
      h={isMd ? "full" : "fit"}
      gap={4}
      borderRightWidth={isMd ? "1px" : 0}
      borderColor="border.disabled"
    >
      {
        //#region Profilmenü
      }
      <Box>
        <ProfileMenu>
          <Flex
            cursor={"pointer"}
            p="4"
            justifyContent={ isMd && collapsed ? "center" : "left"}
            borderBottomWidth={"1px"}
            borderColor="border.disabled"
            borderRadius={0}
            color="fg.disabled"
            backgroundColor="bg.subtle"
            alignItems={"center"}
            _hover={{ bg: "bg.muted" }}
          >
            <Flex gap={2} alignItems={"center"}>
              <Avatar.Root>
                <Avatar.Fallback name="Bencso" />
              </Avatar.Root>

              <Box fontWeight="bold" textStyle="label" color="fg.default" hidden={isMd && collapsed}>
                Bencso
              </Box>
            </Flex>
          </Flex>
        </ProfileMenu>

        {
          //#endregion
          //#region LINKEK implementálása
        }
        {links.map((link: LinkType, index: number) => {
          return (
            <Link href={link.link || "/"} key={index}>
              <Box
                p="4"
                aria-current={
                  mounted && pathname === link.link ? "page" : undefined
                }
                display={"flex"}
                hidden={!isMd}
                borderBottomWidth={"1px"}
                borderColor="border.disabled"
                textDecoration={"none"}
                alignItems={"center"}
                justifyContent={ collapsed ? "center" : "left"}
                gap={4}
                borderLeftWidth="2px"
                borderLeftColor={"border.disabled"}
                borderRadius={0}
                fontSize={12}
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
                { !collapsed && link.name}
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
        hidden={!isMd}
        flexDir={ collapsed ? "column-reverse" : "row"}
        borderColor="border.disabled"
        color="fg.disabled"
        alignItems={"center"}
        gap={4}
      >
        <IconButton onClick={()=>{
        setCollapsed((prev)=> !prev)
       }} variant="outline" size="sm">
        {
          !collapsed ? <LuArrowLeftToLine/> :  <LuArrowRightToLine/>
        }
        </IconButton> 
        <InfoPopover />
        <ColormodeSwitcher />
        <LanguageSwitcher />
      </Flex>
    </Flex>
  );
};
