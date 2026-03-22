import { useKeyboardShortcut } from "@/providers/keyboardShortcut";

export default function keyboardShortcuts({
  setSelectedImg,
  selectedImg,
  step,
  imgs,
  sendMessage,
  setImgs,
  setSelectedImage,
  setStep,
}: {
  setSelectedImg: any;
  selectedImg: any;
  step: number;
  imgs: any;
  sendMessage: any;
  setImgs: any;
  setSelectedImage: any;
  setStep: any;
}) {
  //#region SHORTCUTS
  useKeyboardShortcut({
    key: "ArrowLeft",
    onKeyPressed: () => {
      if (step === 1) {
        if (selectedImg - 1 >= 0) {
          setSelectedImg(selectedImg - 1);
        }
      }
    },
  });

  useKeyboardShortcut({
    key: "ArrowRight",
    onKeyPressed: () => {
      if (step === 1) {
        if (selectedImg + 1 < imgs.length) {
          setSelectedImg(selectedImg + 1);
        }
      }
    },
  });

  useKeyboardShortcut({
    key: "R",
    onKeyPressed: () => {
      if (step === 1) {
        sendMessage({ message: "newSession" });
        setImgs([]);
        setSelectedImage(undefined);
        setSelectedImg(0);
        setStep(0);
      }
    },
  });
  //#endregion
}
