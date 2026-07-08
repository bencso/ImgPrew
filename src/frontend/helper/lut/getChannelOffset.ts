import { ParamProps } from "@/interfaces/interface";

export function getChannelOffsets(params: ParamProps) {
  const channels = new Float32Array([
    params.red_red_channel / 100.0,
    params.green_red_channel / 100.0,
    params.blue_red_channel / 100.0,

    params.red_green_channel / 100.0,
    params.green_green_channel / 100.0,
    params.blue_green_channel / 100.0,

    params.red_blue_channel / 100.0,
    params.green_blue_channel / 100.0,
    params.blue_blue_channel / 100.0,
  ]);

  const offset = new Float32Array([
    params.red_channel_offset / 100.0,
    params.green_channel_offset / 100.0,
    params.blue_channel_offset / 100.0,
  ]);

  return { channels, offset };
}