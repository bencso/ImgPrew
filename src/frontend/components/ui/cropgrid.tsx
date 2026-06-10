import { Box, Grid, GridItem } from "@chakra-ui/react";

export const CropGrid = () => {
  return (
            <Grid
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                templateColumns="repeat(3, 1fr)"
                templateRows="repeat(3, 1fr)"
                pointerEvents="none"
                border="2px solid white"
                borderCollapse={"collapse"}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <GridItem
                    key={i}
                    border="1px dashed rgba(255, 255, 255, 0.5)"
                  />
                ))}
                <Box
                  h={"full"}
                  w={"full"}
                  position={"absolute"}
                  boxShadow="1px 1px 0px 100vh #00000047"
                >
                  <Box
                    position="absolute"
                    top={"-0.5"}
                    left={"-0.5"}
                    w="20px"
                    h="20px"
                    borderTop="2px solid"
                    borderLeft="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    top={"-0.5"}
                    right={"-0.5"}
                    w="20px"
                    h="20px"
                    borderTop="2px solid"
                    borderRight="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    top={"-0.5"}
                    left={"calc(50% - 15px )"}
                    translateX={"-50%"}
                    w="30px"
                    borderTop="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    bottom={"-0.5"}
                    left={"calc(50% - 15px)"}
                    translateX={"-50%"}
                    w="30px"
                    borderTop="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    left={"-0.5"}
                    top={"calc(50% - 15px)"}
                    translateY={"-50%"}
                    h="30px"
                    borderLeft="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    right={"-0.5"}
                    top={"calc(50% - 15px)"}
                    translateY={"-50%"}
                    h="30px"
                    borderRight="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    bottom={"-0.5"}
                    right={"-0.5"}
                    w="20px"
                    h="20px"
                    borderBottom="2px solid"
                    borderRight="2px solid"
                    borderColor="white"
                  />
                  <Box
                    position="absolute"
                    bottom={"-0.5"}
                    left={"-0.5"}
                    w="20px"
                    h="20px"
                    borderBottom="2px solid"
                    borderLeft="2px solid"
                    borderColor="white"
                  />
                </Box>
              </Grid>
  );
};
