export const temperatureFragment = `
        originalLuminance = dot(rgb, vec3(0.299, 0.587, 0.114));
        rgb.r *= (1.0 + temperature_input * 0.1);
        rgb.b *= (1.0 - temperature_input * 0.1);
        rgb.g *= (1.0 - tint_input * 0.1);
        currentLuminance = dot(rgb, vec3(0.299, 0.587, 0.114));
        rgb *= (originalLuminance / max(currentLuminance, 0.0001));
`;
