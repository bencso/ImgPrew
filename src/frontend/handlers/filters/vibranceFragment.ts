export const vibranceFragment = `
    float minChannel = min(min(rgb.r, rgb.g), rgb.b);
    float maxChannel = max(max(rgb.r, rgb.g), rgb.b);
    
    float vibranceSaturation = maxChannel - minChannel;    
    float faktor = vibrance_input * (1.0 - vibranceSaturation);
    
    vec3 v_hsv = rgbToHsv(rgb);

    float skin_distance = min(abs(v_hsv.x - 0.05), 1.0 - abs(v_hsv.x - 0.05));
    float mask = smoothstep(0.02, 0.08, skin_distance);

    currentLuminance = dot(rgb, vec3(0.299, 0.587, 0.114));

    rgb = mix(vec3(currentLuminance), rgb, 1.0 + (faktor * mask));
`;