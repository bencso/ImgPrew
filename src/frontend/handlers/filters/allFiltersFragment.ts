import { brightnessExposureContrastFragment } from "./brightnessExposureContrastFragment";
import { channelMixerFragment } from "./channelMixerFragment";
import { hueFragment } from "./hueFragment";
import { levelsFragment } from "./levels";
import { temperatureFragment } from "./temperatureFragment";
import { vibranceFragment } from "./vibranceFragment";

/*
Temperature/Tint
Exposure
Contrast
Brightness
Hue/Saturation/Value
*/

export const allFiltersFragment = `
  precision highp float;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    uniform float exposure_input;
    uniform float brightness_input;
    uniform float contrast_input;

    uniform float temperature_input;
    uniform float tint_input;

    uniform float hue_input;
    uniform float saturation_input;
    uniform float value_input;

    uniform float black_input;
    uniform float gamma_input;
    uniform float white_input;
    uniform float outblack_input;
    uniform float outwhite_input;

    uniform mat3 channel_colorMatrix_input;
    uniform vec3 channel_offset_input;

    uniform float vibrance_input; 

    float originalLuminance;
    float currentLuminance;
    

    vec3 rgbToHsv(vec3 color) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 maxBG = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));
      vec4 maxPR = mix(vec4(maxBG.xyw, color.r), vec4(color.r, maxBG.yzx), step(maxBG.x, color.r));
      float saturation = maxPR.x - min(maxPR.w, maxPR.y);
      float e = 1.0e-10;
      return vec3(abs(maxPR.z + (maxPR.w - maxPR.y) / (6.0 * saturation + e)), saturation / (maxPR.x + e), maxPR.x);
    }

    vec3 hsvToRgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
      vec3 p = fract(c.xxx + K.xyz) * 6.0 - K.www;
      vec3 rgb = c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
      return rgb;
    }

    void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec3 rgb = color.rgb;

    ${temperatureFragment}
    ${brightnessExposureContrastFragment}
    ${hueFragment}
    ${levelsFragment}
    ${vibranceFragment}
    ${channelMixerFragment}

    rgb = clamp(rgb, 0.0, 1.0);

    gl_FragColor = vec4(rgb, color.a);
    }
`;
