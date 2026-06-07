import { CustomImage } from "@/interfaces/interface";
import {
  Button,
  DialogActionTrigger,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Image,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogTitle,
  Carousel,
  IconButton,
  HStack,
  Text,
  DialogContext,
  useDialogContext,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuDownload } from "react-icons/lu";

interface SuccessfullDialogProps {
  successfullyImageShow: boolean;
  setSuccessfullyImageShow: Dispatch<SetStateAction<boolean>>;
  successfullyImages: SuccessfullyImagesProps[];
  selectedImage?: CustomImage | undefined;
}

export interface SuccessfullyImagesProps {
  title: string;
  data: string;
  extension: string;
}

export const SuccessfullDialog = (props: SuccessfullDialogProps) => {
  let images = props.successfullyImages ?? [];

  const [page, setPage] = useState(0);
  const hasMultipleImages = images.length > 1;
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.successfullyImageShow && images.length > 0) {
      setOpen(true);
      setPage(0);
    } else {
      setOpen(false);
    }
  }, [props.successfullyImageShow, images]);

  const currentImage = images[page] || images[0];

  if (images.length === 0) return null;

  const handleClose = () => {
    setOpen(false);
    props.setSuccessfullyImageShow(false);
    setPage(0);
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
    >
      <DialogContent
        borderRadius="l3"
        boxShadow="2xl"
        zIndex={open ? "max" : "-1000"}
        pos={"absolute"}
        right={4}
        bottom={4}
        p={0}
        m={0}
        maxW="md"
        w="100%"
      >
        <DialogHeader borderBottomWidth="1px" py={4}>
          <DialogTitle fontSize="lg" fontWeight="bold">
            {hasMultipleImages
              ? `Sikeres exportálás! (${images.length} kép)`
              : "Sikeres exportálás!"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody p={6} bg="bg.muted" position="relative">
          {hasMultipleImages ? (
            <Carousel.Root
              slideCount={images.length}
              page={page}
              onPageChange={(e) => setPage(e.page)}
            >
              <Carousel.ItemGroup>
                {images.map((sI, index) => (
                  <Carousel.Item
                    key={index}
                    index={index}
                    display="flex"
                    justifyContent="center"
                  >
                    <Image
                      src={sI.data}
                      alt={sI.title || "Kiexportált kép"}
                      maxH="40vh"
                      objectFit="contain"
                      borderRadius="l2"
                      shadow="md"
                    />
                  </Carousel.Item>
                ))}
              </Carousel.ItemGroup>

              <HStack justify="space-between" mt={4} px={2}>
                <Carousel.PrevTrigger asChild>
                  <IconButton size="sm" variant="subtle" aria-label="Előző kép">
                    <LuChevronLeft />
                  </IconButton>
                </Carousel.PrevTrigger>

                <Text fontSize="sm" fontWeight="medium">
                  {page + 1} / {images.length}
                </Text>

                <Carousel.NextTrigger asChild>
                  <IconButton
                    size="sm"
                    variant="subtle"
                    aria-label="Következő kép"
                  >
                    <LuChevronRight />
                  </IconButton>
                </Carousel.NextTrigger>
              </HStack>
            </Carousel.Root>
          ) : (
            <DialogBody display="flex" justifyContent="center" p={0}>
              <Image
                src={currentImage.data}
                alt={currentImage.title || "Kiexportált kép"}
                maxH="45vh"
                objectFit="contain"
                borderRadius="l2"
                shadow="md"
              />
            </DialogBody>
          )}
        </DialogBody>

        <DialogFooter
          borderTopWidth="1px"
          gap={3}
          justifyContent="space-between"
        >
          <HStack gap={2}>
            {currentImage && (
              <Button
              as={"a"}
                //@ts-ignore
                href={currentImage.data}
                download={`${crypto.randomUUID()}.${currentImage.extension ?? "jpg"}`}
              >
                <LuDownload />
                Aktuális letöltése
              </Button>
            )}
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
