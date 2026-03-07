# A tone curve alapja

- A tone curve egy függvény:
        input brightness → output brightness

Tartomány:
0 → 255

Példa S-curve:
input  output
0   →   0
64  →   40
128 →   128
192 →   220
255 →   255

# Rendszer maga
PixiJS: WebGL alapú

vec3 mapped;

mapped.r = texture(curveTex, vec2(color.r, 0.0)).r;
mapped.g = texture(curveTex, vec2(color.g, 0.0)).r;
mapped.b = texture(curveTex, vec2(color.b, 0.0)).r;

color.rgb = mapped;

# UI

- x,y pontokat létrehozni
- és svg-ben a pontokat megjeleníteni, amiket lehet húzni -> és erre egy curvePathet generálni a pontokból