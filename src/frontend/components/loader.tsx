"use client";

import { Box, Spinner } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

export default function Loader({ isLoaded }: { isLoaded: boolean }) {
    return (
        <AnimatePresence>
            {!isLoaded && (
                <MotionBox
                    w="100vw"
                    h="100vh"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    position="fixed"
                    top="0"
                    left="0"
                    zIndex="overlay"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}

                    bg="rgba(0,0,0,0.4)"
                    backdropFilter="blur(12px)"
                >
                    <Spinner
                        color="teal.400"
                        size="xl"
                    />
                </MotionBox>
            )}
        </AnimatePresence>
    );
}
