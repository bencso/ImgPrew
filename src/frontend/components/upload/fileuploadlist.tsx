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
        smDown: "repeat(2, minmax(0,1fr))",
        smToXl: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(3, minmax(0, 1fr))",
      }}
      gap={3}
    >
      {files.map((file, index) => (
        <FileUpload.Item
          key={`${file.name}-${index}`}
          file={file}
          p={3}
          w={"full"}
          borderWidth="1px"
          borderRadius="md"
          justifyContent={"center"}
          position="relative"
          _hover={{ bg: "bg.muted" }}
        >
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="start"
            w={"100%"}
            justifyContent={"center"}
            gap={2}
          >
            <FileUpload.ItemName fontSize={"xs"} maxW={"90%"} />
            <FileUpload.ItemSizeText/>
          </Box>

        
            <FileUpload.ItemDeleteTrigger
              minH={10}
              minW={10}
              borderRadius="full"
              color="fg.error"
              _hover={{ color: "fg.error/50" }}
            >
              <LuTrash size={14} />
            </FileUpload.ItemDeleteTrigger>
        
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  );
};
