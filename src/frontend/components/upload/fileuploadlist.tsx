import { Box, FileUpload, Float, useFileUploadContext } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";

export const FileUploadList = () => {
  const fileUpload = useFileUploadContext();

  const files = fileUpload.acceptedFiles;

  if (files.length === 0) return null;

  return (
    <FileUpload.ItemGroup
      display="grid"
      p={0}
      maxHeight={{
        smDown: "160px",
      }}
      overflow={{
        smDown: "scroll",
      }}
      scrollbar={"hidden"}
      gridTemplateColumns={{
        smDown: "repeat(1, minmax(0,1fr))",
        smToXl: "repeat(1, minmax(0, 1fr))",
        xl: "repeat(2, minmax(0, 1fr))",
      }}
      gap={3}
    >
      {files.map((file, index) => (
        <FileUpload.Item
          cursor={"default"}
          key={`${file.name}-${index}`}
          file={file}
          ps={3}
          pe={0}
          py={0}
          w={"full"}
          borderWidth="1px"
          borderRadius={"l3"}
          justifyContent={"center"}
          position="relative"
          overflow={"hidden"}
        >
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="start"
            w={"100%"}
            justifyContent={"center"}
            gap={2}
            py={3}
          >
            <FileUpload.ItemName fontSize={"sm"} maxW={"90%"} />
            <FileUpload.ItemSizeText color={"GrayText"} fontWeight={"light"} />
          </Box>

          <FileUpload.ItemDeleteTrigger
            minH={10}
            minW={10}
            h={"full"}
            bg={"red.subtle"}
            borderLeft={"2px solid"}
            borderColor={"red.muted"}
            transition={"300ms all"}
            color="red.border"
            _hover={{
              color: "red.border",
              backgroundColor: "red.muted",
              borderColor: "red.muted",
            }}
          >
            <LuTrash size={14} />
          </FileUpload.ItemDeleteTrigger>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  );
};
