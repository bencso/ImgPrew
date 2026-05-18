export const hueFragment = `
    currentLuminance = dot(rgb, vec3(0.299, 0.587, 0.114));
    
    if (abs(saturation_input) > 0.0001) {
        rgb = mix(vec3(currentLuminance), rgb, 1.0 + saturation_input);
    }

    rgb = clamp(rgb, 0.0, 1.0); 

    if (abs(hue_input) > 0.0001) {
        vec3 hsv = rgbToHsv(rgb);
        hsv.x = fract(hsv.x + hue_input);
        rgb = hsvToRgb(hsv);
    }

    if (abs(value_input) > 0.0001) {
        rgb = clamp(rgb * (1.0 + value_input), 0.0, 1.0);
    }
`;