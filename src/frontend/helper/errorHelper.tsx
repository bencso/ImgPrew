import { toaster } from "@/components/ui/toaster";

export function minMaxValidation(
  value: number,
  min?: number,
  max?: number,
  factor?: number,
): number {
  let minValue = min ?? -300;
  let maxValue = max ?? Infinity;

  if (value > maxValue || value < minValue) {
    toaster.create({
      type: "error",
      title: "Hibás érték",
      description: `Az érték legalább ${minValue * (factor ?? 1)}${maxValue !== Infinity ? ` és maximum ${maxValue * (factor ?? 1)} ` : ""} lehet`,
      closable: true,
    });
  }

  if (value > maxValue) value = maxValue;
  if (value < minValue) value = minValue;

  return value;
}

export function createError(title: string, description?: string) {
  toaster.create({
    type: "error",
    title: title,
    description: description,
  });
}
