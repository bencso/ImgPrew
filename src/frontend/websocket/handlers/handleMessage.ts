import { toaster } from "@/components/ui/toaster";

const ERROR_MESSAGE = "Ismeretlen, kérjük próbálja újra";

export const handleMessage = (event: MessageEvent) => {
    let rawMessage = JSON.parse(event.data);
    const { message, data } = rawMessage;
    console.log(message + ": " + data);
    switch (message) {
        case "error":
            toaster.create({
                title: "Hiba történt feltöltés közben!",
                description: data ? data : ERROR_MESSAGE,
                type: "error",
            });
        case "success":
            toaster.create({
                title: data,
                type: "success",
            });
    }
};
