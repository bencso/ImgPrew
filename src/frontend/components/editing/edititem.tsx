import { EditItemProp, InputTypes } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import {
  Box,
  Button,
  Slider,
  CloseButton,
  createListCollection,
  Field,
  FileUpload,
  HStack,
  Input,
  InputGroup,
  Popover,
  Portal,
  RadioCard,
  Select,
  Span,
  Stack,
  Text,
  useBreakpointValue,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import ImageIcon from "../icons/imageIcon";
import { LuEraser, LuFileUp, LuRotateCcw } from "react-icons/lu";

const activeStyle = {
  borderLeftColor: "teal.fg",
  bg: "bg.emphasized",
  color: "fg.default",
  "& svg": { color: "teal.fg" },
};

//#region SIDEBAR ITEM
export const EditItem = ({ items }: { items: EditItemProp }) => {
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  const [open, setOpen] = useState(false);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      positioning={{ placement: isMd ? "left" : "top-start" }}
    >
      <Popover.Trigger asChild>
        <Box
          p="4"
          display={"flex"}
          borderBottomWidth={isMd ? "1px" : "0"}
          borderTopWidth={isMd ? "0" : "2px"}
          borderColor="border.disabled"
          textDecoration={"none"}
          alignItems={"center"}
          flexDirection={isMd ? "column" : "row"}
          justifyContent={"center"}
          h={"full"}
          gap={8}
          w={"full"}
          minH={0}
          px={0}
          borderRightWidth="2px"
          borderLeftColor={"border.disabled"}
          borderRadius={0}
          color="fg.muted"
          _hover={{ bg: "bg.muted" }}
          _focusVisible={activeStyle}
          _active={activeStyle}
          tabIndex={0}
          {...(open && activeStyle)}
          as={"button"}
        >
          {items.icon && items.icon}
          {!items.icon && items.function.substring(0, 3)}
          {isMd && (
            <Text
              rotate={isMd ? "90" : "0"}
              fontSize={"xx-small"}
              w="fit"
              textWrap={"wrap"}
              color={"fg.muted"}
            >
              {items.function}
            </Text>
          )}
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Item items={items} />
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

//#region SIDEBAR ITEM Optionjei
const Item = ({ items }: { items: EditItemProp }) => {
  //#region contextek, és egyéb függőségek
  const { editFunction, selectedImg } = useWorkSession();
  const { ws, sendMessage } = useWebsocket();
  const handleChange = (name: string, value: any) => {
    editFunction(ws, selectedImg, items.function, name, value);
  };
  //#endregion

  return (
    <Stack gap="4">
      {items.inputs &&
        items.inputs.map((item, index) => {
          const collection = createListCollection({
            items:
              item.options instanceof Array && item.options ? item.options : [],
          });
          //#region INPUT kezelés, és eldöntés (switch case)
          switch (item.inputType) {
            //#region select type
            case InputTypes.select:
              return (
                <Box key={index} display={"flex"} flexDirection={"column"}>
                  {item.name.length > 0 && (
                    <Text marginBottom={4}>{item.name}</Text>
                  )}
                  <Select.Root multiple collection={collection} size="sm">
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Válasszon..." />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {item.options instanceof Array &&
                            item.options?.map((option) => (
                              <Select.Item item={option} key={option}>
                                {option}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>
              );
            //#region customElement type
            case InputTypes.customElement:
              return (
                <Box key={index} display={"flex"} flexDirection={"column"}>
                  {item.name.length > 0 && (
                    <Text marginBottom={4}>{item.name}</Text>
                  )}
                  {React.isValidElement(item.options) && (
                    <Fragment>{item.options}</Fragment>
                  )}
                </Box>
              );
            //#region elküldés
            case "submit":
              return (
                <Button
                  key={index}
                  onClick={
                    item.onChange
                      ? item.onChange
                      : (e) => {
                          sendMessage({
                            message: item.name,
                          });
                        }
                  }
                >
                  {item.name}
                </Button>
              );
            //#region radio type
            case "radio":
              return (
                <Box key={index} display={"flex"} flexDirection={"column"}>
                  <RadioCard.Root
                    orientation="vertical"
                    align="center"
                    maxW="400px"
                    value={item.defaultValue ?? item.defaultValue}
                    defaultValue={
                      item.defaultValue
                        ? item.defaultValue
                        : item.options instanceof Array && item.options[0]
                    }
                    variant={"subtle"}
                    colorPalette={"teal"}
                  >
                    <RadioCard.Label>
                      {item.name.length > 0 && item.name}
                    </RadioCard.Label>
                    <HStack w={"full"} flexWrap={"wrap"}>
                      {item.options &&
                        item.options instanceof Array &&
                        item.options.map((option, index) => {
                          return (
                            <RadioCard.Item
                              bg={"bg.panel"}
                              border={"1px solid"}
                              borderColor={"bg.emphasized"}
                              key={index}
                              value={option}
                              onChange={item.onChange || undefined}
                            >
                              <RadioCard.ItemHiddenInput />
                              <RadioCard.ItemControl>
                                <ImageIcon icon={option} />
                                <RadioCard.ItemText
                                  fontSize={"sm"}
                                  color={"fg.muted"}
                                >
                                  {" "}
                                  {option}
                                </RadioCard.ItemText>
                              </RadioCard.ItemControl>
                            </RadioCard.Item>
                          );
                        })}
                    </HStack>
                  </RadioCard.Root>
                </Box>
              );
            //#region Fájl
            case "file":
              return (
                <FileUpload.Root
                  key={index}
                  onChange={item.onChange ? item.onChange : undefined}
                  gap="1"
                  maxWidth="100%"
                >
                  <FileUpload.HiddenInput />
                  <FileUpload.Label>{item.name}</FileUpload.Label>
                  <InputGroup
                    startElement={<LuFileUp />}
                    endElement={
                      <FileUpload.ClearTrigger asChild>
                        <CloseButton
                          me="-1"
                          size="xs"
                          variant="plain"
                          focusVisibleRing="inside"
                          focusRingWidth="2px"
                          pointerEvents="auto"
                        />
                      </FileUpload.ClearTrigger>
                    }
                  >
                    <Input asChild>
                      <FileUpload.Trigger>
                        <Text color={"fg.muted"} lineClamp={1}>
                          Elfogadott típusok:
                          <Span fontSize={"xs"} key={index}>
                            {" "}
                            {item.options &&
                              item.options instanceof Array &&
                              item.options.join(",")}
                          </Span>
                          {!item.options && <Span>{item.name}</Span>}
                        </Text>
                      </FileUpload.Trigger>
                    </Input>
                  </InputGroup>
                </FileUpload.Root>
              );
            //#endregion
            //#region slider
            case "slider":
              return (
                <Slider.Root
                  value={[item.defaultValue ? Number(item.defaultValue) : 0]}
                  onValueChange={item.onChange ? item.onChange : undefined}
                  defaultValue={[0]}
                  step={item.step ? item.step : 1}
                  key={index}
                  thumbAlignment="center"
                  min={item.min ? item.min : -100}
                  max={item.max ? item.max : 100}
                >
                  <Box
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    display={"flex"}
                    flexDirection={"row"}
                  >
                    <Slider.Label>{item.name}</Slider.Label>
                    <Flex gap={2} alignItems={"center"}>
                      {item.clearFunc !== undefined &&
                        Number(item.defaultValue) !== 0 && (
                          <IconButton
                            size={"sm"}
                            variant={"ghost"}
                            colorScheme={"teal"}
                            onClick={
                              item.clearFunc ? item.clearFunc : undefined
                            }
                          >
                            <LuRotateCcw />
                          </IconButton>
                        )}
                      <Slider.ValueText color={"fg.muted"}>
                        {Math.floor(Number(item.defaultValue) * 100)}
                      </Slider.ValueText>
                    </Flex>
                  </Box>
                  <Slider.Control mt={2}>
                    <Slider.Track bg="teal.900">
                      <Slider.Range bg="teal.500" />
                    </Slider.Track>
                    <Slider.Thumb index={0} boxSize={6} borderColor="teal.500">
                      {item.icon && (
                        <Box
                          justifyContent={"center"}
                          alignItems={"center"}
                          display={"flex"}
                          color="teal.500"
                          boxSize={3}
                        >
                          {item.icon}
                        </Box>
                      )}
                    </Slider.Thumb>
                  </Slider.Control>
                </Slider.Root>
              );
            //#endregion
            //#region egyéb / minden nem egyedi type
            default:
              return (
                <Field.Root key={index}>
                  {item.name.length > 0 && (
                    <Field.Label>{item.name}</Field.Label>
                  )}
                  <Input
                    onChange={(event) =>
                      handleChange(item.name, event.target.value)
                    }
                    type={item.inputType}
                    placeholder="40px"
                  />
                </Field.Root>
              );
          }
        })}
    </Stack>
  );
};
