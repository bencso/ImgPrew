import { ServerMessage } from "@/providers/websocketprovider";
import { UseFileUploadReturn } from "@chakra-ui/react";
import { RefObject } from "react";

interface uploadFileProps {
  sendMessage: ({ message, data }: ServerMessage) => void;
  ws: RefObject<WebSocket | null>;
  fileUpload: UseFileUploadReturn;
}

export const uploadFile = async ({
  fileUpload,
  ws,
  sendMessage,
}: uploadFileProps) => {
  var files = fileUpload.acceptedFiles;
  const readFile = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {};

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Nem ArrayBuffer"));
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  try {
    const bufferArrays: number[] = [];
    const buffers = await Promise.all(
      files.map(async (file) => {
        bufferArrays.push(file.size);
        return await readFile(file);
      }),
    );

    const array = bufferArrays.reduce(
      (acc: { start: number; end: number }[], curr) => {
        const start = acc.length ? acc[acc.length - 1].end : 0;

        acc.push({
          start,
          end: start + curr,
        });

        return acc;
      },
      [],
    );

    const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);

    const combined = new Uint8Array(totalLength);
    let offset = 0;

    for (const buffer of buffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    ws.current?.send(
      JSON.stringify({
        message: "fileUpload",
        data: {
          count: buffers.length,
          totalBytes: totalLength,
          slices: array,
        },
      }),
    );
    ws.current?.send(combined);
  } catch {
    sendMessage({
      message: "error",
      data: `Hiba történt a fájlok feltöltése közben`,
    });
  }
};
