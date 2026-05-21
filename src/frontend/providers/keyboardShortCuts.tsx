import { useKeyboardShortcut } from "@/providers/keyboardShortcut";
import { useSessionStore } from "@/stores/sessionData";

export default function keyboardShortcuts({
  setSelectedImg,
  selectedImg,
  step,
  sessionData,
  setSelectedImage,
  setStep,
}: {
  setSelectedImg: any;
  selectedImg: any;
  step: number;
  sessionData: any;
  setSelectedImage: any;
  setStep: any;
}) {
  const {clearSessionData} = useSessionStore();
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
        if (selectedImg + 1 < sessionData.length) {
          setSelectedImg(selectedImg + 1);
        }
      }
    },
  });

  useKeyboardShortcut({
    key: "R",
    onKeyPressed: () => {
      if (step === 1) {
        setSelectedImage(undefined);
        setSelectedImg(0);
        setStep(0);
        clearSessionData();
      }
    },
  });
  //#endregion
}
