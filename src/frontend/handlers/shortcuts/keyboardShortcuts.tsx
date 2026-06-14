import { useKeyboardShortcut } from "@/providers/keyboardShortcut";
import { useSessionStore } from "@/stores/sessionData";

export default function keyboardShortcuts({
  setSelectedImg,
  selectedImg,
  step,
  setSelectedImage,
  setStep,
  appRef,
  setHaldImage,
}: {
  setSelectedImg: any;
  selectedImg: any;
  step: number;
  setSelectedImage: any;
  setStep: any;
  appRef: any;
  setHaldImage: any;
}) {
  const { clearSessionData, sessionData } = useSessionStore();

  //#region SHORTCUTS
  useKeyboardShortcut({
    key: "ArrowLeft",
    onKeyPressed: () => {
      if (step === 1) {
        if (selectedImg - 1 >= 0) {
          setSelectedImg((prev: number) => {
            const prevImg = sessionData.find((si) => si.id == prev);

            (async () => {
              if (prevImg && appRef.current) {
                const haldImage = await appRef.current.renderer.extract.base64({
                  target: prevImg.haldSprite,
                  format: "png",
                  resolution: 1,
                });
                setHaldImage(prev, haldImage);
              }
            })();

            return prev - 1;
          });
        }
      }
    },
  });

  useKeyboardShortcut({
    key: "ArrowRight",
    onKeyPressed: () => {
      if (step === 1) {
        if (selectedImg + 1 < sessionData.length) {
          setSelectedImg((prev: number) => {
            const prevImg = sessionData.find((si) => si.id == prev);
            (async () => {
              if (prevImg && appRef.current) {
                const haldImage = await appRef.current.renderer.extract.base64({
                  target: prevImg.haldSprite,
                  format: "png",
                  resolution: 1,
                });
                setHaldImage(prev, haldImage);
              }
            })();

            return prev + 1;
          });
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
