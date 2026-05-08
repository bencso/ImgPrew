export const channelMixerFragment = `
    vec3 mixedColor = (channel_colorMatrix_input * rgb) + channel_offset_input;
`;
