export const brightnessExposureContrastFragment = `
        rgb *= pow(2.0, exposure_input);
        rgb += brightness_input;
        rgb = ((rgb - 0.5) * contrast_input) + 0.5;
`;
