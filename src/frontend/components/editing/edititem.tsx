import { EditItemProp, InputTypes } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import {
  Box,
  Button,
  CloseButton,
  createListCollection,
  Field,
  FileUpload,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Popover,
  Portal,
  RadioCard,
  Select,
  Slider,
  Span,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { LuFileUp, LuRotateCcw } from "react-icons/lu";
import { BeatLoader } from "react-spinners";
import ImageIcon from "../icons/imageIcon";

//#region SIDEBAR ITEM
export const EditItem = ({ items }: { items: EditItemProp }) => {
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  const [open, setOpen] = useState(false);

  return (
    items && !items.hide && (
      <Popover.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        positioning={{ placement: isMd ? "left" : "top-start" }}
      >
        <Popover.Trigger asChild w="80px" h="80px">
          <Button
            w={"full"}
            h={"full"}
            variant={"surface"}
            rounded={"xl"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
            gap={3}
            border={"0"}
          >
            {isMd && items.icon && items.icon}
            <Text
              fontSize="xx-small"
              textWrap={"wrap"}
              textAlign={"center"}
              mt={0}
              w={"full"}
              lineHeight={"1.2"}
            >
              {items.function && items.function}
            </Text>
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content maxWidth="300px" minW={"300px"} w={"300px"}  rounded={"l3"} opacity={1}>
              <Popover.Body>
                <Item items={items} />
              </Popover.Body>
              <Popover.CloseTrigger />
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    )
  );
};

//#region SIDEBAR ITEM Optionjei
const Item = ({ items }: { items: EditItemProp }) => {
  //#region contextek, és egyéb függőségek
  const { editFunction, selectedImg } = useWorkSession();
  const handleChange = (name: string, value: any) => {
    editFunction({
      selectedImg,
      functionName: items.function,
      inputName: name,
      value,
    });
  };
  //#endregion

  return (
    !items.hide && (
      <Flex wrap="wrap" gap={8} direction="row">
        {items.inputs &&
          items.inputs.map((item, index) => {
            const collection = createListCollection({
              items:
                item.options instanceof Array && item.options
                  ? item.options
                  : [],
            });
            //#region INPUT kezelés, és eldöntés (switch case)
            switch (item.inputType) {
              //#region select type
              case InputTypes.select:
                return (
                  <Box key={index} minW="200px" flex="1">
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
                  <Box
                    key={index}
                    display={"flex"}
                    flexDirection={"column"}
                    minW="200px"
                    flex="1"
                  >
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
                    spinner={<BeatLoader size={12} color={"#004d40"} />}
                    onClick={item.onChange ? item.onChange : (e) => {}}
                    minW="200px"
                    flex="1"
                  >
                    {item.name}
                  </Button>
                );
              //#region radio type
              case "radio":
                return (
                  <Box
                    key={index}
                    display={"flex"}
                    flexDirection={"column"}
                    minW="200px"
                    flex="1"
                  >
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
                    minW="200px"
                    flex="1"
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
                const [liveValue, setLiveValue] = useState(
                  Number(item.defaultValue),
                );

                useEffect(() => {
                  setLiveValue(Number(item.defaultValue));
                }, [item.defaultValue]);

                return (
                  <Slider.Root
                    onValueChange={(e) => {
                      setLiveValue(e.value[0]);
                      item.onChange && item.onChange(e);
                    }}
                    onValueChangeEnd={(e) => {
                      item.onChangeEnd && item.onChangeEnd(e);
                    }}
                    key={index}
                    value={[liveValue]}
                    thumbAlignment="center"
                    min={item.min ?? 0}
                    max={item.max ?? 1}
                    step={item.step ?? 0.1}
                    minW="200px"
                    flex="1"
                    px={2}
                    boxSizing={"border-box"}
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
                          Number(item.defaultValue) !== null && (
                            <IconButton
                              size={"sm"}
                              variant={"ghost"}
                              colorScheme={"teal"}
                              onClick={() => {
                                setLiveValue(Number(item.resetValue));
                                item.clearFunc && item.clearFunc();
                              }}
                            >
                              <LuRotateCcw />
                            </IconButton>
                          )}
                        <Slider.ValueText color={"fg.muted"}>
                          {Number(liveValue)}
                        </Slider.ValueText>
                      </Flex>
                    </Box>
                    <Slider.Control mt={2}>
                      <Slider.Track css={{...item.style}}>
                        <Slider.Range bg={"transparent"}/>
                      </Slider.Track>
                      <Slider.Thumb
                        index={0}
                        boxSize={6}
                        borderColor="teal.500"
                        rounded={"l3"}
                      >
                        {item.icon  && (
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
                  <Field.Root key={index} minW="200px" flex="1">
                    {item.name.length > 0 && (
                      <Field.Label>{item.name}</Field.Label>
                    )}
                    <Input
                      onChange={(event) => {
                        handleChange(item.name, event.target.value);
                      }}
                      onInput={item.onChange ? item.onChange : undefined}
                      type={item.inputType}
                      placeholder={item.name}
                    />
                  </Field.Root>
                );
            }
          })}
      </Flex>
    )
  );
};
