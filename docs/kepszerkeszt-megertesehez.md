
# LUT (Look Up Table)

Milyen szín bemenethez -> milyen szín kimenet megy.

**Tulajdonképpen egy:** bemeneti-kimeneti mátrix -> *színek, világosság, kontraszt, szaturáció….*  
**Fájlformátum:** .cube

A legjobb, ha **LUT** készítéshez, LOG formátumú *(nyers)* fényképet használunk, mert ezen láthatóak jól a színek és a kontrasztok *("kicsit szürkés kép")*

### 

### Beállítások

### 

### Színkorrekció

A Color correction *(vagyis színkorrekció)* esetén állítjuk be az alábbiakat:

* **fehéregyensúly**
* **expozíció**
* **kontraszt**

A kép "normális" kinézetének megalkotása

### 

### Színosztályzás / Fényelés

A Color grading *(vagyis fényelés)* esetén az alábbi kép tulajdonságokat állíthatjuk:

* **árnyékok *(shadows)***
* **középtónusok *(midtonees)***
* **csúcsfények *(highlights)***

*Lightroom*-os működés [(kép)](https://halado.fotokonyv.hu/wp-content/uploads/2021/09/2021-09-24_19-51-48.jpg):

* Egy *"színes kör/kerék"*
* Sliderek (HSL)

### 

### *Kerék (ez kihagyható -> helyette elég csak a HSL sliderek)*


A kerékben egy kezelő van, a kezelő a **telítettséget** szabályozza

* középpontól való távolság a telítettséget változtatja -> ha középen van telítettség **nulla *(nincs színárnyalat)*** -> ha a szélén van akkor **100**

***=> minél szélibb van annál nagyobb érték***

### 

### *Slider (HSL)*

A **színárnyalatot**, vagyis **HSL értékeket** lehet vele szabályozni:

H -> ***Hue*:** *színezettség*

S -> ***Saturation*:** *szín telítettség*

L -> ***Luminance*:** *szín sötétség*

* ***Tulajdonképpen a kerékkel ezeket állítjuk, "jobban látható kerékkel" hogy mi is történik, de ezeket az értékeket (H,S,L) változtatja ő is***

### 

### *Blending, Balance*

**Blending** felel a *színek közötti átfedéséért* (közép érték -> 0 - 50 - 100)

* Balra vagyis a 0 felé közelítve:

  * Színek kevésbé keverednek
* Jobb vagyis 100 felé közelítve:

  * Jobban keverednek

**Balance** pedig meghatározza, melyik **fényerőtartomány** legyen **dominánsabb** (közép érték -100 - 0 - 100)

* Balra húzva:

  * Árnyékhoz rendelt szín átmegy a *csúcsfénybe, középtónusokba (mit is jelent ez valójában?)*
* Jobbara húzva:

  * *Csúcsfény* veszi át a vezetést



### Lift, Gamme, Gain -> ezt ki lesz hagyva …. (Ennek utoljára utánanézni, csak kíváncsiságból - ez too much már)

Lift, Gamma, Gain színkerekek, \*\*színkorrekciókra \*\*lettek kitalálva.

* \*\*Lift (sötét tónusok) \*\*-> “whites”
* \*\*Gamma (középtónus) \*\*-> “black”
* \*\*Gain (fények) \*\*-> teljes színárnyalat spektrumon állítunk
* **Offset (teljes kép)**

RGB görbe:  
*-> **Átlós tengely:***  
- Bal alsó: sötét pontok  
- Jobb felső: fehér pontok  
-> ***Függőleges***\*:\* színek fényereje  
-> ***Vízszintes***\*: \*Színtónus szabályozásra



### Funkciók és implementálása:

* **Utánanézni:** Hogyan tudnám megvalósítani ezeket WebGL, és BE-n?

**Amik *(a külön szekcióban)* lehetnének, mert talán megvalósítható utánajárás után, szerintem:**

* **Exposure, Brightness, Contrast** *(ezek alapból vannak is, és lesznek is….annyi hogy lehet WebGL megoldással)*
* **HSV (Hue, Saturation, Value), Vibrance** -> ehhez jön a **shadow tint** és a **highlight tint** -> [https://www.geeksforgeeks.org/computer-graphics/hsv-color-model-in-computer-graphics/](https://www.geeksforgeeks.org/computer-graphics/hsv-color-model-in-computer-graphics/)
* **Levels (Shadows, Midtones, Highlights)** -> [https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/](https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/)
* **Channel mixer** -> [https://www.tourboxtech.com/en/news/channel-mixer.html](https://www.tourboxtech.com/en/news/channel-mixer.html)


### HSV

* H -> Hue
* S -> Telítettség / Saturation
* V -> value / érték

Egy kúp, ahol *piros-kék spektruma* **balról jobbra**, **középről** <-> **szélre** pedig az *intenzitás* növekszik
Alulról felfelé, pedig a fényerő nő.
Fehér a középső rétegben.

![image](https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/HSV\_color\_solid\_cone\_chroma\_gray.png/250px-HSV\_color\_solid\_cone\_chroma\_gray.png)

#### Hue
Megmondja a szöget, a **színtér hengerén,** amely **meghatározza a színt**, **0-360** fok között változik
**0-60** piros, **60-120** sárga, **120-180** zöld, **180-240** cyan, **240-300** kék, **300-360** magenta

#### Saturation
A telítettség értéke megmondja, hogy mennyi színmennyiséget kell hozzááadni, 100%nál azt jelenti hogy teljes "tiszta" színt adnak hozzá, míg 0%nál szürkeárnyalat lesz.

#### Value
A **Saturation** fényerőt adja, a 0 érték teljes **fekete sötétség,** míg a 100 teljes **fényerőt** jelent, illetve ez függ a **telítettségtől**.

##### Kódolás / Megoldás

###### rgbToHsv

Elsősorban **RGB** -> **HSV**-t kell implementálni:

**R' G' B'**
	-> R / alpha (0,255)
	-> G / alpha (0,255)
	-> B / alpha (0,255)
**Cmax** = max(R',G',B')
**Cmin** = min(R',G',B')
**Δ** = Cmax-Cmin


###### Hue

Három eset van, ha a Cmax az egyenlő **R'**-rel, vagyis az **R'** a legnagyobb akkor
$$
60^\circ \cdot \frac{(G'-B')}{Δ}  \bmod 6)
$$

Ha a **G**
$$
60^\circ \cdot  \frac{(B'-R')}{Δ}  + 2)
$$

Ha a **B**
$$
60^\circ \cdot  \frac{(R'-G')}{Δ} + 4)
$$

$$
H =
\begin{cases}
60^\circ \cdot \left( \frac{G' - B'}{\Delta} \bmod 6 \right), & \text{ha } C_{\max} = R' \\
60^\circ \cdot \left( \frac{B' - R'}{\Delta} + 2 \right), & \text{ha } C_{\max} = G' \\
60^\circ \cdot \left( \frac{R' - G'}{\Delta} + 4 \right), & \text{ha } C_{\max} = B'
\end{cases}
$$

###### Saturation

Itt két esetünk van, ha a Cmax 0 vagy nem nulla

Ha **0**, akkor a **Saturation is 0**
Különben pedig:
**Δ/Cmax**

###### Value

**Value = Cmax**

###### **GSLS-ben**
1. Esetlegesen: https://www.npmjs.com/package/glsl-hsv2rgb

```glsl
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
```

2. Vagy az alábbi módon:

```glsl
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
```

> **-1/3** és a **2/3** eltolások a *color wheel* miatt kell

```glsl
vec4 maxBG = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));
```

> Összehasonlítja a **b** és **g** értékekekt, és rendezi az adatokat **(Maximum kiválasztás)**

```glsl
vec4 maxPR = mix(vec4(maxBG.xyw, color.r), vec4(color.r, maxBG.yzx), step(maxBG.x, color.r));
```

> Összehasonlítja a \*\*p\*\* és \*\*r\*\* értékeket, és rendezi az adatokat \*\*(Maximum kiválasztás még egyszer)\*\* => *p* rendezés, majd *q* rendezés

```glsl
float saturation = maxPR.x - min(maxPR.w, maxPR.y);
```

> legnagyobb és legkisebb különbség => ez lesz a **telítettség**

```glsl
float e = 1.0e-10;
```

> ne lehessen nullával osztani

*Hue:*

```glsl
abs(maxPR.z + (maxPR.w - maxPR.y) / (6.0 \* saturation + e))
```

> szín a színkörön hol van

*Saturation:*

```glsl
saturation / (maxPR.x + e)
```


> ha nincs különbség a komponensek között => 0 -> szürke
> ha nagy különbség => élénk szín

######  Kód implementálás (GPU barát)

```glsl
vec3 rgbToHsv(vec3 color){
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);

	vec4 maxBG = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));
	vec4 maxPR = mix(vec4(maxBG.xyw, color.r), vec4(color.r, maxBG.yzx), step(maxBG.x, color.r));

	float saturation = maxPR.x - min(maxPR.w, maxPR.y);
	float e = 1.0e-10;

	return vec3(abs(maxPR.z + (maxPR.w - maxPR.y) / (6.0 * saturation + e)), saturation / (maxPR.x + e), maxPR.x);
}
```

---

###### hsvToRgb

Ami úgy hangzik, hogy: 
H/S/V:
- H: 0 <= H < 360 (UI szinten)
- S: 0 <= S <= 1
- V: 0 <= V <= 1

*UI-nál 360, de ezt majd a logikához osztani kell 360-val*

C = V * S *(Színtelítettség mértéke)*
$$
X =  C * (1 - | \frac{H}{60^\circ} \mod 2 -1 |)
$$
m = V - C *(Fényerő korrekció)*

majd a változók kiszámítása utána az árnyalat tartomány alapján meghatározzuk az **R'G'B'**-t

| Tartomány | R'G'B' |
|--|--|
| 0 <= H < 60 |  (C,X,0) |
| 60 <= H < 120|  (X,C,0) |
| 120 <= H < 180 |  (0,C,X) |
| 180 <= H < 240|  (0,X,C) |
| 240 <= H < 300 |  (X,0,C) |
| 300 <= H < 360 |  (C,0,X) |

Majd az **RGB** kiszámítása:

R = (R' + m) * 255
G = (G' + m) * 255
B = (B' + m) * 255

######  Kód implementálás (GPU barát)

```glsl
vec3 hsvToRgb(vec3 c) {  
	vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);  
	vec3 p = fract(c.xxx + K.xyz) * 6.0 - K.www;   
	vec3 rgb = c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);  
	  
return rgb;  
}
```
> Normalizálás, a GPU 0-1 tartományba számol ugye


```glsl
vec3 rgb = v * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), s);
```
> **fehér alap** => vec3(1.0)
> **színes** => clamp(p - 1, 0, 1)
> clamp, hogy 0-1 között legyen; 0 = **fekete**, 1 = **színes**

###### Ezek funkciók implementálása
```glsl
vec3 rgb = hsvToRgb();
FragColor = vec4(rgb, 1.0);
```

### Levels

### Channel Mixer

### Lábjegyzet:
Továbbiakban, késöbb jó lehet:
* [Vignette ](https://stack.gl/packages/#TyLindberg/glsl-vignette)
* [LUT](https://stack.gl/packages/#thibauts/parse-cube-lut)

### Források:

* [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)
* [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)
* [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)
