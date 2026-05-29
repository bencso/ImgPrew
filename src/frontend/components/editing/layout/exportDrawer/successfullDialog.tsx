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
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface SuccessfullDialogProps {
  successfullyImageShow: boolean;
  setSuccessfullyImageShow: Dispatch<SetStateAction<boolean>>;
  successfullyImage: string;
  selectedImage?: CustomImage | undefined;
}

export const SuccessfullDialog = (props: SuccessfullDialogProps) => {
  return (
    <DialogRoot
      open={props.successfullyImageShow}
      onOpenChange={(e) => props.setSuccessfullyImageShow(e.open)}
    >
      <DialogContent
        borderRadius="l3"
        boxShadow="2xl"
        zIndex={"max"}
        pos={"absolute"}
        right={4}
        bottom={4}
        p={0}
        m={0}
      >
        <DialogHeader borderBottomWidth="1px" py={4}>
          <DialogTitle fontSize="lg" fontWeight="bold">
            Sikeres exportálás!
          </DialogTitle>
        </DialogHeader>

        <DialogBody
          p={6}
          bg="bg.muted"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={props.successfullyImage}
            alt="Kiexportált kép"
            maxH="50vh"
            objectFit="contain"
            borderRadius="l2"
            shadow="md"
          />
        </DialogBody>

        <DialogFooter borderTopWidth="1px" gap={3}>
          <DialogActionTrigger asChild>
            <Button variant="ghost">Bezárás</Button>
          </DialogActionTrigger>

          <Button
            as={"a"}
            //@ts-ignore
            href={props.successfullyImage}
            download={`exportalas.${props.selectedImage?.exportSettings?.fileExtension ?? "jpg"}`}
            bg="brand.solid"
          >
            Letöltés
          </Button>
        </DialogFooter>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
