export const levelsFragment = `
        rgb = clamp((rgb - black_input) / max(white_input - black_input, 0.0001), 0.0, 1.0);

        rgb = pow(rgb, vec3(1.0 / max(gamma_input, 0.01)));

        rgb = rgb * (outwhite_input - outblack_input) + outblack_input;
`;
