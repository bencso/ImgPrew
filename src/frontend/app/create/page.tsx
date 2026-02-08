import { ImageDropZone } from "@/components/upload/dropzone";
import { WebsocketProvider } from "@/providers/websocketprovider";

export default function Page() {
    return (
        <WebsocketProvider>
        <ImageDropZone />
        </WebsocketProvider>
    )
}