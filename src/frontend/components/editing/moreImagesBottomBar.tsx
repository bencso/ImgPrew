import { useWorkSession } from "@/providers/sessionprovider";
import { Box, Flex, GridItem, Kbd, Separator, Image, useBreakpointValue } from "@chakra-ui/react";

export default function BottomBar() {
    const { step, imgs, setSelectedImg, selectedImg } = useWorkSession();

    //#region breakPoint beállíátoks (isMd)
    const isMd = useBreakpointValue(
        { base: false, sm: false, md: false, lg: true, xl: true },
        { ssr: false, fallback: "md" }
    );
    //#endregion

    return (
        imgs.length > 1 && <GridItem borderTop={"1px solid"} bg={"bg.subtle"} borderColor={"bg.muted"} w={"full"} maxW={"full"} h={"full"} alignItems={"center"} gap={4} display={"flex"} flexDir={"column"}>
            {
                //#region billentyűzet kbd nyilak
            }
            {
                isMd && imgs.length > 1 && (
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={6}
                        fontSize="sm"
                        color="fg.muted"
                        bg={"bg"}
                        p={2}
                        px={6}
                        borderBottomEndRadius={"lg"}
                        borderBottomStartRadius={"lg"}
                    >
                        <Box userSelect={"none"} cursor={!(selectedImg - 1 >= 0) ? "disabled" : "pointer"} onClick={() => {
                            if (step === 1) {
                                if (selectedImg - 1 >= 0) {
                                    setSelectedImg(selectedImg - 1);
                                }
                            }
                        }} display="flex" justifyContent={"center"} alignItems="center" gap={4}>
                            <Kbd>←</Kbd>
                            <Box>Előző</Box>
                        </Box>
                        <Separator orientation={"vertical"} w={1} h={"full"} />
                        <Box cursor={!(selectedImg + 1 < imgs.length) ? "disabled" : "pointer"} userSelect={"none"} onClick={() => {
                            if (step === 1) {
                                if (selectedImg + 1 < imgs.length) {
                                    setSelectedImg(selectedImg + 1);
                                }
                            }
                        }} display="flex" justifyContent={"center"} alignItems="center" gap={4}>
                            <Box>Következő</Box>
                            <Kbd>→</Kbd>
                        </Box>
                    </Box>
                )
            }
            {
                //#endregion
            }
            {imgs.length > 1 && (
                <Flex
                    gap={4}
                    justifyContent={"center"}
                >
                    {imgs.map((img, index) => {
                        const isActive = selectedImg === index;

                        return (
                            <Box
                                key={img}
                                cursor="pointer"
                                minH={"100px"}
                                minW={"100px"}
                                maxH={"100px"}
                                maxW={"100px"}
                                w={"full"}
                                h={"full"}
                                onClick={() => setSelectedImg(index)}
                            >
                                <Box
                                    borderRadius="md"
                                    overflow="hidden"
                                    h={"full"}
                                    w={"full"}
                                    opacity={isActive ? 1 : 0.4}
                                    transition="opacity 0.2s ease"
                                    _hover={{ opacity: 0.8 }}
                                >
                                    <Image
                                        src={img}
                                        alt={`thumbnail-${index}`}
                                        w="full"
                                        h="full"
                                        bg={"bg.muted"}
                                        objectFit="cover"
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Flex>
            )}
        </GridItem>
    )
}