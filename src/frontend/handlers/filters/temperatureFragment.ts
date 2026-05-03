export const temperatureFragment = `
        originalLuminance = dot(rgb, vec3(0.299, 0.587, 0.114));
        rgb.r += temperature_input * 0.2;
        rgb.b -= temperature_input * 0.2;
        rgb.g -= tint_input * 0.2;
        currentLuminance = dot(rgb, vec3(0.299, 0.587, 0.114));
        rgb *= (originalLuminance / max(currentLuminance, 0.0001));
`;
