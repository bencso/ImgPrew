//TODO: Refaktorálás
import { allFiltersFragment } from "@/handlers/filters/allFiltersFragment";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box } from "@chakra-ui/react";
import "pixi-filters";
import {
  Application,
  Container,
  defaultFilterVert,
  Filter,
  GlProgram,
  ImageSource,
  Sprite,
  Texture,
  UniformGroup,
} from "pixi.js";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

export default function WebGlComponent() {
  const {
    selectedImg,
    setSelectedScale,
    textureRef,
    spriteRef,
    appRef,
    workPlaceRef,
    textAndImagePlaceRef,
  } = useWorkSession();
  const { sessionData, setImageSize } = useSessionStore();

  const canvasRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<Container | null>(null);

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

  useEffect(() => {
    async function initApp() {
      const app = new Application();
      appRef.current = app;
      await appRef.current.init({
        backgroundAlpha: 1,
        webgl: {
          antialias: true,
        },
        webgpu: {
          antialias: false,
        },
        textureGCActive: true,
        textureGCMaxIdle: 7200,
        textureGCCheckCountMax: 1200,
      });

      // @ts-ignore
      window.__PIXI_DEVTOOLS__ = {
        app,
      };

      // @ts-ignore
      globalThis.__PIXI_APP__ = app;
    }

    initApp();
  }, []);

  async function loadImage() {
    if (!appRef.current) return;

    const img = new Image();

    img.onload = async () => {
      if (!appRef.current) return;

      await appRef.current.init();

      const source = new ImageSource({ resource: img });
      const texture = new Texture({ source });

      textureRef.current = texture;
      const sprite = new Sprite(texture);

      sprite.anchor.set(0.5);

      const prevStage = appRef.current.stage.children.filter(
        (fs) => fs !== sprite,
      )[0];

      if (prevStage) appRef.current.stage.removeChild(prevStage);
      appRef.current.stage.addChild(sprite);
      spriteRef.current = sprite;

      if (canvasRef.current) {
        canvasRef.current.replaceChildren(appRef.current.canvas);
      }

      applyFilters();
      resizeSprite();
    };

    img.src = sessionData[selectedImg].blob;
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = new Container();
    filtersRef.current = container;

    loadImage();

    return () => {
      if (spriteRef.current) {
        spriteRef.current.destroy();
        spriteRef.current = null;
      }

      if (textureRef.current) {
        textureRef.current.destroy(false);
        textureRef.current?.source.unload();
        textureRef.current = null;
      }

      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, [selectedImg]);

  const resizeSprite = () => {
    if (
      !spriteRef.current ||
      !textureRef.current ||
      !canvasRef.current ||
      !appRef.current ||
      !workPlaceRef.current
    )
      return;

    const imgW = textureRef.current.width;
    const imgH = textureRef.current.height;

    // Kiszámoljuk a képnél hogy melyik az ami belefér, majd kiválasszuk belőle a legkissebbet
    const scale = Math.min(
      workPlaceRef.current.offsetWidth / imgW,
      workPlaceRef.current.offsetHeight / imgH,
    );

    const width = imgW * scale;
    const height = imgH * scale;

    spriteRef.current.width = width;
    spriteRef.current.height = height;

    if (appRef.current.renderer)
      appRef.current.renderer.resize(
        workPlaceRef.current.clientWidth,
        workPlaceRef.current.clientHeight,
      );

    if (textAndImagePlaceRef.current) {
      textAndImagePlaceRef.current.style.height = height + "px";
      textAndImagePlaceRef.current.style.width = width + "px";
    }

    if (appRef.current) {
      spriteRef.current.x = appRef.current.canvas.width / 2;
      spriteRef.current.y = appRef.current.canvas.height / 2;
    }

    setSelectedScale({
      image: {
        height: imgH,
        width: imgW,
      },
      scale: scale,
      position: {
        x: appRef.current.canvas.width / 2,
        y: appRef.current.canvas.height / 2,
      },
    });

    setImageSize(selectedImg, imgW, imgH);
  };

  const applyFilters = () => {
    if (!spriteRef.current || !appRef.current) return;

    const filterUniforms = new UniformGroup({
      exposure_input: { value: filters.exposure, type: "f32" },
      brightness_input: { value: filters.brightness, type: "f32" },
      contrast_input: { value: filters.contrast, type: "f32" },
      temperature_input: { value: filters.temperature / 100.0, type: "f32" },
      tint_input: { value: filters.tint / 100.0, type: "f32" },
      saturation_input: { value: filters.saturation, type: "f32" },
      hue_input: { value: filters.hue / 360.0, type: "f32" },
      value_input: { value: filters.value, type: "f32" },
      black_input: { value: filters.black / 255.0, type: "f32" },
      white_input: { value: filters.white / 255.0, type: "f32" },
      outblack_input: { value: filters.outblack / 255.0, type: "f32" },
      outwhite_input: { value: filters.outwhite / 255.0, type: "f32" },
      gamma_input: { value: filters.gamma, type: "f32" },
    });

    const webgFilters = new Filter({
      glProgram: new GlProgram({
        fragment: allFiltersFragment,
        vertex: defaultFilterVert,
      }),
      resources: {
        filterUniforms: filterUniforms,
      },
    });

    spriteRef.current.filters = [webgFilters];
  };

  useEffect(() => {
    resizeSprite();
  }, [selectedImg]);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const expandMode =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
    ) ?? "no";

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const borderSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.borderSize,
  );

  const expandBackground =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandBackground,
    ) ?? "#fffff";

  const imageSize = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.dimesions,
  );

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
  );

  const cropSaved = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.cropSave || false,
    shallow,
  );

  function calculateExpandMode() {
    const type = expandMode;
    if (
      appRef.current &&
      textureRef.current &&
      spriteRef.current &&
      workPlaceRef.current &&
      imageSize
    )
      if (type !== "expand") {
        const areaW = workPlaceRef.current.offsetWidth;
        const areaH = workPlaceRef.current.offsetHeight;

        const scale = Math.min(
          areaH / imageSize.height,
          areaW / imageSize.width,
        );
        appRef.current.renderer.resize(areaW, areaH);
        appRef.current.renderer.background.color = "transparent";

        spriteRef.current.width = imageSize.width * scale;
        spriteRef.current.height = imageSize.height * scale;

        if (textAndImagePlaceRef.current) {
          if (type === "no")
            textAndImagePlaceRef.current.style.height =
              (canvasRef.current?.offsetHeight ?? areaH) + "px";
          else textAndImagePlaceRef.current.style.height = "100%";
          if (type === "no")
            textAndImagePlaceRef.current.style.width =
              imageSize.width * scale + "px";
          else textAndImagePlaceRef.current.style.width = "100%";
        }

        if (expandMode === "crop") {
          spriteRef.current.x = box?.x ?? appRef.current.canvas.width / 2;
          spriteRef.current.y = box?.y ?? appRef.current.canvas.height / 2;
        } else {
          spriteRef.current.x = appRef.current.canvas.width / 2;
          spriteRef.current.y = appRef.current.canvas.height / 2;
        }
      } else {
        const workPlaceSize = workPlaceRef.current;
        const areaW = workPlaceSize.offsetWidth;
        const areaH = workPlaceSize.offsetHeight;
        const h = expandSize?.height ?? imageSize.height;
        const w = expandSize?.width ?? imageSize.width;

        if (!areaW || !areaH || !w || !h || !textAndImagePlaceRef.current)
          return;

        const canvasScale = Math.min(areaW / w, areaH / h);

        const canvasW = Math.round(w * canvasScale);
        const canvasH = Math.round(h * canvasScale);

        appRef.current.renderer.resize(canvasW, canvasH);
        appRef.current.renderer.background.color = expandBackground;

        const imgW = textureRef.current.width;
        const imgH = textureRef.current.height;

        const imageScale = Math.min(canvasW / imgW, canvasH / imgH);

        let spW = Math.round(imgW * imageScale);
        let spH = Math.round(imgH * imageScale);

        spriteRef.current.width = spW;
        spriteRef.current.height = spH;

        textAndImagePlaceRef.current.style.height =
          (appRef.current.renderer.height ?? spH) + "px";
        textAndImagePlaceRef.current.style.width =
          (appRef.current.renderer.width ?? spW) + "px";

        spriteRef.current.x = appRef.current.canvas.width / 2;
        spriteRef.current.y = appRef.current.canvas.height / 2;
      }
  }

  function calculateExpandSize() {
    if (
      !workPlaceRef.current ||
      !appRef.current ||
      !textureRef.current ||
      !spriteRef.current ||
      !imageSize
    )
      return;

    if (expandMode !== "expand") {
      const areaW = workPlaceRef.current.offsetWidth;
      const areaH = workPlaceRef.current.offsetHeight;

      const scale = Math.min(areaH / imageSize.height, areaW / imageSize.width);
      appRef.current.renderer.resize(areaW, areaH);
      appRef.current.renderer.background.color = "transparent";

      spriteRef.current.width = imageSize.width * scale;
      spriteRef.current.height = imageSize.height * scale;

      if (textAndImagePlaceRef.current) {
        textAndImagePlaceRef.current.style.height =
          imageSize.height * scale + "px";
        textAndImagePlaceRef.current.style.width =
          imageSize.width * scale + "px";
      }
      if (
        (expandMode === "border" &&
          borderSize &&
          borderSize.x &&
          borderSize.y) ||
        (expandMode === "crop" &&
          borderSize &&
          borderSize.x &&
          borderSize.y &&
          cropSaved)
      ) {
        if (
          expandMode === "crop" &&
          box &&
          box.height &&
          box.width &&
          box.x &&
          box.y
        ) {
          //TODO: Tényleges croppolás kell itt mert különben nem jó, vagy valami overflow beállítás?
          spriteRef.current.height = box.height - +borderSize.x;
          spriteRef.current.width = box.width - +borderSize.y;
          spriteRef.current.x = box.x / 2;
          spriteRef.current.y = box.y / 2;
        } else {
          spriteRef.current.width = imageSize.width * scale - +borderSize.x;
          spriteRef.current.height = imageSize.height * scale - +borderSize.y;
        }
        const areaW = spriteRef.current.width + borderSize.x;
        const areaH = spriteRef.current.height + borderSize.y;
        appRef.current.renderer.background.color = expandBackground;
        appRef.current.renderer.resize(areaW, areaH);
      }

      if (expandMode == "crop" && box && !cropSaved) {
        const cropSizeRelative = {
          height: box.height ?? imageSize.height * (scale ?? 1),
          width: box.width ?? imageSize.width * (scale ?? 1),
        };

        spriteRef.current.x = box.x ?? appRef.current.canvas.width / 2;
        spriteRef.current.y = box.y ?? cropSizeRelative.height / 2;
      } else {
        spriteRef.current.x = appRef.current.canvas.width / 2;
        spriteRef.current.y = appRef.current.canvas.height / 2;
      }
    } else {
      const workPlaceSize = workPlaceRef.current;
      const areaW = workPlaceSize.offsetWidth;
      const areaH = workPlaceSize.offsetHeight;

      const h = expandSize?.height ?? imageSize.height;
      const w = expandSize?.width ?? imageSize.width;

      if (!areaW || !areaH || !w || !h || !textAndImagePlaceRef.current) return;

      const canvasScale = Math.min(areaW / w, areaH / h);

      const canvasW = Math.round(w * canvasScale);
      const canvasH = Math.round(h * canvasScale);

      appRef.current.renderer.resize(canvasW, canvasH);
      appRef.current.renderer.background.color = expandBackground;

      const imgW = textureRef.current.width;
      const imgH = textureRef.current.height;

      const imageScale = Math.min(canvasW / imgW, canvasH / imgH);

      let spW = Math.round(imgW * imageScale);
      let spH = Math.round(imgH * imageScale);

      spriteRef.current.width = spW;
      spriteRef.current.height = spH;

      textAndImagePlaceRef.current.style.height =
        (appRef.current.renderer.height ?? spH) + "px";
      textAndImagePlaceRef.current.style.width =
        (appRef.current.renderer.width ?? spW) + "px";

      spriteRef.current.x = appRef.current.canvas.width / 2;
      spriteRef.current.y = appRef.current.canvas.height / 2;
    }
  }

  useEffect(() => {
    calculateExpandMode();
  }, [expandMode, imageSize, selectedImg]);

  useEffect(() => {
    calculateExpandSize();
  }, [expandSize, expandBackground, imageSize, selectedImg, borderSize]);

  useEffect(() => {
    const handleResize = () => {
      resizeSprite();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedImg]);

  return (
    <Box
      alignItems={expandMode !== "crop" ? "center" : undefined}
      justifyContent={expandMode !== "crop" ? "center" : undefined}
      display={expandMode !== "crop" ? "flex" : undefined}
      ref={canvasRef}
    />
  );
}
