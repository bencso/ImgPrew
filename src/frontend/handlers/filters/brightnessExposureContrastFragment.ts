//Reinhard Tone Mapping alapú expozíció
export const brightnessExposureContrastFragment = `

        float exp_mult = pow(2.0, exposure_input);
        vec3 exposed_rgb = rgb * exp_mult;

        if(exposure_input > 0.0){
                currentLuminance = dot(exposed_rgb, vec3(0.299, 0.587, 0.114));
                
                rgb = mix(exposed_rgb,clamp(exposed_rgb,0.0,1.0), smoothstep(0.7, 1.0, currentLuminance));
        } 
        else {
                rgb = exposed_rgb;
        }

       if (contrast_input != 1.0) {
                rgb = clamp(rgb, 0.0, 1.0);
                rgb = (rgb - 0.5) * contrast_input + 0.5;
        }

        rgb += brightness_input * 0.2;
`;
