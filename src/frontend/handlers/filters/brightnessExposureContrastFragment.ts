//Reinhard Tone Mapping alapú expozíció
export const brightnessExposureContrastFragment = `
        float exp_mult = pow(2.0, exposure_input);
        vec3 exposed_rgb = rgb * exp_mult;

       rgb = exposed_rgb / (1.0 + (exposed_rgb / 10.0)); // A 10.0 a "fehér pont"

       if (contrast_input != 1.0) {
                rgb = clamp(rgb, 0.0, 1.0);
                rgb = (rgb - 0.5) * contrast_input + 0.5;
        }

        rgb += brightness_input * 0.2;
`;
