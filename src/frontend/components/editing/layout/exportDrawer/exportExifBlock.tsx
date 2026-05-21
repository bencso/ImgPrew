import { GridItem, Stack, Grid, Checkbox } from "@chakra-ui/react";
import { useState } from "react";

const initialValues = [
  { label: "Teszt", checked: false, value: "Teszt1" },
  { label: "Teszt", checked: false, value: "Teszt2" },
  { label: "Teszt", checked: false, value: "Teszt3" },
  { label: "Teszt", checked: false, value: "Teszt44" },
  { label: "Teszt", checked: false, value: "Teszt25" },
  { label: "Teszt", checked: false, value: "Teszt36" },
  { label: "Teszt", checked: false, value: "Teszt47" },
  { label: "Teszt", checked: false, value: "Teszt21214" },
  { label: "Teszt", checked: false, value: "Teszdt4213" },
  { label: "Teszt", checked: false, value: "Tes41zt4" },
  { label: "Teszt", checked: false, value: "Teszdtdd2" },
  { label: "Teszt", checked: false, value: "Tes41zt3" },
  { label: "Teszt", checked: false, value: "Teszdt4" },
  { label: "Teszt", checked: false, value: "Tes41zt2" },
  { label: "Teszt", checked: false, value: "Tes41zt3" },
  { label: "Teszt", checked: false, value: "Tesdzt4" },
];
export const ExportExifBlock = () => {
  const [values, setValues] = useState(initialValues);

  const allChecked = values.every((value) => value.checked);
  const indeterminate = values.some((value) => value.checked) && !allChecked;

  const items = values.map((item, index) => (
    <GridItem key={index}>
      <Checkbox.Root
        ms="6"
        key={item.value}
        colorPalette={"teal"}
        checked={item.checked}
        onCheckedChange={(e) => {
          setValues((current) => {
            const newValues = [...current];
            newValues[index] = { ...newValues[index], checked: !!e.checked };
            return newValues;
          });
        }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>{item.label}</Checkbox.Label>
      </Checkbox.Root>
    </GridItem>
  ));

  return (
    <Stack align="flex-start">
      <Checkbox.Root
        colorPalette={"teal"}
        checked={indeterminate ? "indeterminate" : allChecked}
        onCheckedChange={(e) => {
          setValues((current) =>
            current.map((value) => ({ ...value, checked: !!e.checked })),
          );
        }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Összes</Checkbox.Label>
      </Checkbox.Root>
      <Grid gap={2} templateColumns={"repeat(4, 1fr)"} mt={2}>
        {items}
      </Grid>
    </Stack>
  );
};
