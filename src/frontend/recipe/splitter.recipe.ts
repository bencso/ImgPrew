import { splitterAnatomy } from "@chakra-ui/react/anatomy";
import { defineSlotRecipe } from "@chakra-ui/react";

export const splitterSlotRecipe = defineSlotRecipe({
    slots: splitterAnatomy.keys(),
    base: {
        resizeTriggerIndicator: {
            "display": "none"
        }
    }
});