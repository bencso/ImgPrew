import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function Loader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      position={"fixed"}
      inset={0}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={"bg"}
      zIndex={"max"}
    >
      <BeatLoader color="#38B2AC" size={12} />
    </Box>
  );
}
