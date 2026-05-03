import { brightnessExposureContrastFragment } from "./brightnessExposureContrastFragment";
import { temperatureFragment } from "./temperatureFragment";

export const allFiltersFragment = `
  precision highp float;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform float exposure_input;
    uniform float brightness_input;
    uniform float contrast_input;
    uniform float temperature_input;
    uniform float tint_input;

    float originalLuminance;
    float currentLuminance;

    void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec3 rgb = color.rgb;

    ${temperatureFragment}
    ${brightnessExposureContrastFragment}

    gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
    }
`;
