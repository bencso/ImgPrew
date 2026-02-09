"use client";

import { Box, Spinner } from "@chakra-ui/react";

export default function Loader({ isLoaded }: { isLoaded: boolean }) {
    return (

        <Box
            w="100vw"
            h="100vh"
            display={!isLoaded ? "flex" : "hidden"}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            position="fixed"
            top="0"
            left="0"
            zIndex="overlay"
            bg="rgba(0,0,0,0.4)"
            backdropFilter="blur(12px)"
        >
            <Spinner
                color="teal.400"
                size="xl"
            />
        </Box>
    )
}
