"use client";

import { Box, Spinner } from "@chakra-ui/react";

export default function Loader({ isLoaded }: { isLoaded: boolean }) {
    if (isLoaded) return null;

    return (
        <Box
            position="fixed"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(0,0,0,0.4)"
            backdropFilter="blur(12px)"
            zIndex="overlay"
        >
            <Spinner color="teal.400" size="xl" />
        </Box>
    );
}