import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  GridItem,
  Stack,
  Grid,
  Checkbox,
  Box,
  Text,
  Input,
  Span,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

type ExifItem = {
  label: string;
  checked: boolean;
  description: string;
};

interface ExportExifBlockProp {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

export const ExportExifBlock = (props: ExportExifBlockProp) => {
  const [values, setValues] = useState<ExifItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const exifTags =
    useSessionStore(
      (state) =>
        state.sessionData.find((i) => i.id === props.selected)?.exifDatas,
      shallow,
    ) ?? [];

  useEffect(() => {
    const uniqueTags = Array.from(new Set(exifTags));

    setValues(
      uniqueTags.map((tag: any) => ({
        label: tag["key"],
        description: tag["item"],
        checked: false,
      })),
    );
    setSearchQuery("");
  }, [exifTags]);

  if (exifTags.length === 0) {
    return (
      <Text color="fg.muted" fontSize="sm" py={4}>
        Nincs EXIF adat ehhez a képhez.
      </Text>
    );
  }

  const filteredItems = values.filter(
    (item) =>
      item.label
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchQuery.toLowerCase()) ||
      item.description
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(searchQuery.toLowerCase()),
  );

  const allFilteredChecked =
    filteredItems.length > 0 && filteredItems.every((value) => value.checked);
  const indeterminate =
    filteredItems.values().some((value) => value.checked) &&
    !allFilteredChecked;

  const handleToggleAllFiltered = (isChecked: boolean) => {
    setValues((current) =>
      current.map((value) => {
        const isVisible = filteredItems.some((f) => f.label === value.label);
        if (isVisible) {
          return { ...value, checked: isChecked };
        }
        return value;
      }),
    );
  };

  return (
    <Stack align="stretch" w="full">
      <Text textTransform={"uppercase"} fontSize={"xs"} fontWeight={"bold"}>
        Exif adatok
      </Text>

      <Input
        placeholder="EXIF adat keresése (pl. ISO, GPS)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="sm"
        variant="outline"
      />

      <Box borderBottomWidth="1px" pb={3} borderColor="border.muted">
        <Checkbox.Root
          mt={3}
          colorPalette="teal"
          checked={indeterminate ? "indeterminate" : allFilteredChecked}
          onCheckedChange={(e) => handleToggleAllFiltered(!!e.checked)}
          disabled={filteredItems.length === 0}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label fontWeight="semibold">
            {searchQuery
              ? `Találatok kijelölése (${filteredItems.length})`
              : `Összes kijelölése (${filteredItems.length})`}
          </Checkbox.Label>
        </Checkbox.Root>
      </Box>

      <Box
        maxH="280px"
        overflowY="auto"
        pr={2}
        css={{
          "&::-webkit-scrollbar": { width: "0" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        {filteredItems.length === 0 ? (
          <Text color="fg.muted" fontSize="sm" textAlign="center" py={4}>
            Nincs találat erre: "{searchQuery}"
          </Text>
        ) : (
          <Grid
            gap={3}
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
          >
            {filteredItems.slice(0, 9).map((item, index) => (
              <GridItem key={item.label + "-" + index}>
                <Checkbox.Root
                  colorPalette="teal"
                  checked={item.checked}
                  onCheckedChange={(e) => {
                    setValues((current) =>
                      current.map((val) =>
                        val.label === item.label
                          ? { ...val, checked: !!e.checked }
                          : val,
                      ),
                    );
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label maxW="250px" lineClamp={1} title={item.label}>
                    {item.label}{" "}
                    <Span fontSize={"x-small"}>({item.description})</Span>
                  </Checkbox.Label>
                </Checkbox.Root>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};
