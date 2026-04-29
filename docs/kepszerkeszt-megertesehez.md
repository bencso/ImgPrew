# LUT (Look Up Table)

Milyen szín bemenethez -> milyen szín kimenet megy.

**Tulajdonképpen egy:** bemeneti-kimeneti mátrix -> _színek, világosság, kontraszt, szaturáció…._
**Fájlformátum:** .cube

A legjobb, ha **LUT** készítéshez, LOG formátumú _(nyers)_ fényképet használunk, mert ezen láthatóak jól a színek és a kontrasztok _("kicsit szürkés kép")_

### 

# Színkorrekció

A Color correction _(vagyis színkorrekció)_ esetén állítjuk be az alábbiakat:

* **fehéregyensúly**
* **expozíció**
* **kontraszt**

A kép "normális" kinézetének megalkotása

# Exposure, Brightness, Contrast
Ez a három elengedhetetlen egy képszerkesztőben…

- **Exposure (Expozíció):** Ebben az esetben nem összeadunk, hanem _szorzunk_.
    - **Úgy viselkedik, mint a kamera lencséje:** ha növekszik akkor minden pixel arányosan több fényt kap, ez az _Fényérték_ alapján számoljuk, ami _2-es alapú hatványozás ($2^{\text{exposure}}$)_.
  - **Brightness (Fényerő):** Sima _összeadás/kivonás_. Minden pixelhez lineárisan hozzáadunk egy értéket.
  - **Contrast (Kontraszt):** _Szorzás_ egy pont _(szürke)_ körül.
      - Kivonunk _0.5_-öt ezáltal a _sötétek negatívak lesznek, a világosak pozítivak_, ezt megszorozzuk a kontraszt értékével, majd visszaadunk hozzá amit elvettünk _(0.5)_ => a _világos világosabb_ a _sötét sötétebb_ lesz
   
#### GLSL / WebGL 
A GPU-nak ezek a számítások nem „drága", így ezt általában egy shaderbe, egy filterbe szokták tenni.

3 sliderre van szükségünk:
1. **Exposure:** _-3_ és _3_ közötti érték _(alapértelmezett 0)_
2. **Brightness:** _-1_ és _1_ közötti érték  _(alapértelmezett 0)_
3. **Contrast:** _0_ és _2_  (vagy több) közötti érték   _(alapértelmezett 1)_

Elsősorban megállapítjuk a textura eredeti pixeleit
`vec4 color = texture2D(uSampler, vTextureCoord); 
vec3 rgb = color.rgb;`

és ezek után a müveletek elvégezzük
- **Exposure** esetén az _rgb_-t megszorozzuk a ($2^{\text{exposure}}$)-val (itt érdemes a beépített _pow_ fgv-t használni)
- **Brightness** esetén _rgb_-hez hozzáadjuk a _brightness_-t
- **Contrast** esetén pedig kivonjuk az _rgb_-ből a _0.5_-t, majd megszorozzuk a _contrast_-tal és visszaadjuk neki a _0.5_-t

Ezek után pedig normalizáljuk _(clamp-pal 0 és 1 közötti értékre)_
és átadjuk a _gl_FragColor_nak egy _4vect_ ként az erdeti alfával

# Színosztályzás / Fényelés

A Color grading _(vagyis fényelés)_ esetén az alábbi kép tulajdonságokat állíthatjuk:

**árnyékok _(shadows)_**
**középtónusok _(midtonees)_**
**csúcsfények _(highlights)_**

_Lightroom_-os működés [(kép)](https://halado.fotokonyv.hu/wp-content/uploads/2021/09/2021-09-24_19-51-48.jpg):

* Egy _"színes kör/kerék"_
* Sliderek (HSL)

### 

# Kerék (ez kihagyható -> helyette elég csak a HSL sliderek)

A kerékben egy kezelő van, a kezelő a **telítettséget** szabályozza

középpontól való távolság a telítettséget változtatja -> ha középen van telítettség **nulla _(nincs színárnyalat)_** -> ha a szélén van akkor **100**

**_=> minél szélibb van annál nagyobb érték_**

### 

# Slider (HSL)

A **színárnyalatot**, vagyis **HSL értékeket** lehet vele szabályozni:

H -> **Hue**: _színezettség_
S -> **Saturation**: _szín telítettség_
L -> **Luminance**: _szín sötétség_

* _**Tulajdonképpen a kerékkel ezeket állítjuk, "jobban látható kerékkel" hogy mi is történik, de ezeket az értékeket (H,S,L) változtatja ő is**_

### 

# Blending, Balance

**Blending** felel a _színek közötti átfedéséért_ (közép érték -> 0 - 50 - 100)

* Balra vagyis a 0 felé közelítve:

  * Színek kevésbé keverednek
* Jobb vagyis 100 felé közelítve:

  * Jobban keverednek

**Balance** pedig meghatározza, melyik **fényerőtartomány** legyen **dominánsabb** (közép érték -100 - 0 - 100)

* Balra húzva:

  * Árnyékhoz rendelt szín átmegy a _csúcsfénybe, középtónusokba (mit is jelent ez valójában?)_
* Jobbara húzva:

  * _Csúcsfény_ veszi át a vezetést

# Lift, Gamma, Gain -> ezt ki lesz hagyva …. (Ennek utoljára utánanézni, csak kíváncsiságból - ez too much már)

Lift, Gamma, Gain színkerekek, \*\*színkorrekciókra \*\*lettek kitalálva.

* \*\*Lift (sötét tónusok) \*\*-> “whites”
* \*\*Gamma (középtónus) \*\*-> “black”
* \*\*Gain (fények) \*\*-> teljes színárnyalat spektrumon állítunk
* **Offset (teljes kép)**

RGB görbe:  
-> **Átlós tengely:**  
- Bal alsó: sötét pontok  
- Jobb felső: fehér pontok  
-> **Függőleges**: színek fényereje  
-> **Vízszintes**: Színtónus szabályozásra

# HSV

* H -> Hue
* S -> Telítettség / Saturation
* V -> value / érték

Egy kúp, ahol _piros-kék spektruma_ **balról jobbra**, **középről** <-> **szélre** pedig az _intenzitás_ növekszik
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

#### Számítás (Matematikai, megértéshez)

#### rgbToHsv

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


#### **Implementálás**
1. Esetlegesen: https://www.npmjs.com/package/glsl-hsv2rgb
```c
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
```

2. Vagy az alábbi módon:

```c
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
```
> **-1/3** és a **2/3** eltolások a _color wheel_ miatt kell

```c
vec4 maxBG = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));
```
> Összehasonlítja a **b** és **g** értékekekt, és rendezi az adatokat **(Maximum kiválasztás)**

```c
vec4 maxPR = mix(vec4(maxBG.xyw, color.r), vec4(color.r, maxBG.yzx), step(maxBG.x, color.r));
```
> Összehasonlítja a **p** és **r** értékeket, és rendezi az adatokat \*\*(Maximum kiválasztás még egyszer)\*\* => _p_ rendezés, majd _q_ rendezés

```c
float saturation = maxPR.x - min(maxPR.w, maxPR.y);
```
> legnagyobb és legkisebb különbség => ez lesz a **telítettség**

```c
float e = 1.0e-10;
```
> ne lehessen nullával osztani

_Hue:_
```c
abs(maxPR.z + (maxPR.w - maxPR.y) / (6.0 \* saturation + e))
```
> szín a színkörön hol van

_Saturation:_
```c
saturation / (maxPR.x + e)
```
> ha nincs különbség a komponensek között => 0 -> szürke
> ha nagy különbség => élénk szín

######  Kód (GPU barát) - rgbToHsv
```c
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

#### hsvToRgb

Ami úgy hangzik, hogy: 
H/S/V:
- H: 0 <= H < 360 (UI szinten)
- S: 0 <= S <= 1
- V: 0 <= V <= 1

_UI-nál 360, de ezt majd a logikához osztani kell 360-val_

C = V * S _(Színtelítettség mértéke)_
$$
X =  C * (1 - | \frac{H}{60^\circ} \mod 2 -1 |)
$$
m = V - C _(Fényerő korrekció)_

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

######  Kód (GPU barát) - hsvToRgb
```c
vec3 hsvToRgb(vec3 c) {  
	vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);  
	vec3 p = fract(c.xxx + K.xyz) * 6.0 - K.www;   
	vec3 rgb = c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);  
	  
return rgb;  
}

float value = color.z / 100.0;
float saturation = color.y / 100.0;
```
> Normalizálás, a GPU 0-1 tartományba számol ugye


```c
vec3 rgb = v * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), s);
```
> **fehér alap** => vec3(1.0)
> **színes** => clamp(p - 1, 0, 1)
> clamp, hogy 0-1 között legyen; 0 = **fekete**, 1 = **színes**

###### hsvToRgb alkalmazása
```c
vec3 rgb = hsvToRgb();
FragColor = vec4(rgb, 1.0);
```

# Levels
Histogram: Térkép, ami megmutatja hogy a fotón, _mennyi sötét, közepes és világos px_ van

_A levels beállításával ezeket a pixeleket lehet "tologatni", mi tudjuk meghatározni hogy hol kezdődjöjn a fekete és a fehér a képen._

- Alsó negyed: _Árnyékok_
- Közép: _Kiemelések_
- Felső negyed: _Midtones_

A Levels tulajdonképpen egy bemeneti pixelértéket kap, és képez belőle egy kimeneti értéket.

Három lépésből fog állni:
1. Normalizálás
2. Gamma korrekció (Midtones)
3. Output mappelése

### Árnyékok
> Black points - fekete pont

A kép legsötétebb pontjait lehet állítani a shadows-sal.

A slider _jobbra_ húzása esetén, azt határozzuk meg, hogy az _ettől a pixeltől balra_ lévő pixeleket _"teljesen feketévé tegyél"_

> Ha a kép szürkésnek tűnik, vagy lapos, és hiányozik belőle a fekete, akkor érdemes használni

### Kiemelések
> Highlights - fehér pont

A kép legvilágosabb pontjait állítja. _(csúcsfények)_

A slidert _balra_ a közepe felé húzzuk, akkor mint az árnyékoknál ugyanazon metódus alapján, azt mondjuk meg, hogy az ettől a _pixeltől jobbra_ lévő pixeleket _"teljes fehérré"_ tegyünk

> Ha a kép túl sötét akkor érdemes használni, vagy ha a fehér színek szürkések.

### Középtónusok
> Midtones - Gamma

Az összes olyan színt és fényerőt állítja, ami nem az elöző két tartományba tartozik _(nem fekete és nem fehér)_

A slider mozgatásával, a közets tartományt tolja el világosabb vagy sötétebb irányba _(a fehér és a fekete marad)_

#### Számítás (Matematikai, megértéshez)

**8 bites képen (0-255 tartomány)**

**Bemeneti paraméterek:** _Black, White, Gamma, OutBlack, OutWhite_

OutBlack alapértelmezetten _0_, az OutWhite _255_

> Ha a Blacket növeljük, azzal a histogram bal szélét toljuk be.

> A White a felső korlát, ha ezt csökkentjük, akkor a világos szürkéket állítjuk be hogy elérjék a 255 fényerőt _(maximálisat)_

> Nem lineáris, mert akkor módosulna a fekte és a fehér is. Ez egy exponencális görbe. Legnagyobb váltzoást 128 értéknél fejti ki _(középen)_

**- Shadows és Highlights:**
A bemeneti pixel-t normalizáljuk, 0-1 tartományban, a **Black** és **White** alapján.
$$x{Norm} = \frac{x - InBlack}{InWhite - InBlack}$$
ha **x < Black** akkor xNorm = 0, ha **x > White** akkor xNorm = 1

**- Gamma / Midtones:**
A középtónus slider nem lineárisan mozgatja az értékeket, hanem hatványfüggvénnyel van. (Így lehet azt megoldani, hogy a tiszta fekete és a tiszta fehér ne változzon)

Így, ha gamma 1 => nincs változás
Ha gamma > 1 => kép világosodík
Különben ha gamma < 1 => kép sötétedik
$$x{Gamma} = (x\_{norm})^{1/\gamma}$$
**- Output levels**
Kimeneti tartományba visszahelyezzük az eredményt:
$$y = x{Gamma} \cdot (OutWhite - OutBlack) + OutBlack$$
#### Implementáció

Példa kép:

![Kép by photoshopessentials ](https://pe-images.s3.amazonaws.com/photo-editing/cc/tone-and-color/levels/gradient-missing-shadows.gif "Kép by photoshopessentials ")

_5 sliderre lesz szükségünk:_
- Bemeneti sliderek _(3)_
      1. Fekete _(InputBlack)_ => 0 <= InputBlack < InputWhite
      2. Szürke _(Gamma)_ => 0.01 <= Gamma <= 9.99
              _=> alapértelmezett: 1.0_
      3. Fehér _(InputWhite)_ => InputBlack < InputWhite <= 255
  - Kimeneti sliderek _(2)_
        1.  Fekete
             _=> alapértelmezett: 0_
        2.  Fehér
             _=> alapértelmezett: 255_
      
Mivel minden pixelre megkéne a hatványozást csinálni ezért ez a matematikai megoldás nem a legjobb…

Így LUT-tal lehet megoldani a legegyszerűbben a dolgot _(python esetében ezt fogjuk nagyvalószínűséggel használni)_

Ha _8 bit_-es képről beszélünk, akkor a max. érték 256 _($2^8$)_ lehet…

1. Szóval mikor a slider változik a fenti képlet szerint, mind a 256 értékre kiszámoljuk
2. Ezt egy tömbben (LUT)-ba eltároljuk
3. A kép pixelein végigmegyünk és csak kiolvassuk az értéket a tömbböl (LUT)
4. És ezt utána csak a kép pixelein végig menve az R/G/B-t változtatjuk (_LUT[px[i + n]]_-> itt _n>3_)

#### PIXI.JS / WebGL implementáció
A WebGL-es megoldáshoz, Shadert ajánlott, mert így nem kell mindig újragenerálni a LUT-ot, hanem egyszerűen az 5 paramétert megadjuk a **GPU** számára Shader segítségével, és a videókártya számol utána a képlet alapján..

- Normalizálás _(clamp függvénnyel)_
- Gamma korrekció
- Output mappelése
- Majd ezt a shadert egy _PIXI.Filter_-ként példányosítjuk

# Channel Mixer
A fotók esetében, mindegyik pixel egy sor RGB értéket tartalmaz. A változtatáskor lényegében a px-ek RGB értékeinek megváltoztatását foglalják magukba, ugyanígy a Channel Mixer esetében.

A Channel Mixer a többi színkorrekciós eszközzel ellentétben nem hozzáaadnak, vagy elvesz egy adott színből, hanem az _eredeti pixelek színcsatornáit használja fel_ egy új channel kiszámításához.

- **Kimeneti csatorna:** A kimeneti csatornába az _R/G/B_-t értékeket lehet választani, ezek kiválasztása esetén, azt választjuk ki hogy melyik csatornát szeretnénk módosítani, befolyásolni.

  Tegyük fel a kék csatornát választjuk, akkor a kimeneti csatorna slidereinél a kiválasztott csatorna _100%_-on lesz a többi alapértelmezetten _0%_.

> Ha változtatjuk tegyük fel a pirosat 50%-ra és az Output channel Green, akkor az RGB-nél  a G érték számítása így néz ki: _(R * R% + G * G% + B * B%)_

#### Számítás (matematikai)
A channel mixert a legegyszerűbb egy **mátrixszorzással** megoldani.

Minden **px** esetén három input van: R, G, B -> _0-255 közötti érték (8 bit esetén)_, illetve **offset** szokott lenni, ami a _világosságot_ állítja
$$ \begin{bmatrix} R' \\\ G' \\\ B' \end{bmatrix} = \begin{bmatrix} c\_{RR} & c\_{RG} & c\_{RB} \\\ c\_{GR} & c\_{GG} & c\_{GB} \\\ c\_{BR} & c\_{BG} & c\_{BB} \end{bmatrix} \begin{bmatrix} R \\\ G \\\ B \end{bmatrix} + \begin{bmatrix} K\_R \\\ K\_G \\\ K\_B \end{bmatrix} $$
- Változók:
    - $c\_{XY}$: A százalékos értékek tizedestört formátumban _(100% = 1.0)_. Az első a _kimeneti_, a második a _bemeneti_ csatorna. (Pl. $c\_{GR}$ a Green output csatorna és a Red slider értéke).
    - $K\_R$: Az eltolás értéke _(-255 és 255 közötti értékek)_

#### Implementálás
Három fő színre R/G/B-re külön külön létre kellene hozni 4 slidert 
R / G / B / Offset

És a _mátrixszorzásokat_ elvégezzük  minden értékre, illetve az offsetet normalizáljuk _-255-255 _skáláról _-1.0-1.0_-ra

Ezekből az értékekből készítünk egy 1D-s tömböt (3x3 mátrix), és egy 3 elemü tömböt az Offsetnek. Ezeket a GLSL-nek _uniform_ változóként adjuk, mert mindenegyes pixelre haználni kell majd. _(colorMatrix, offset)_

#### WebGL / GLSL

Az  eredeti színeket kiolvassuk a texturából _(texture2D segítségével)_
    -> _vec4_ type-val: **R,G,B,A**: itt mindegyik érték _0.0_ és _1.0_ között
Mátrixszorzást alkalmazzuk a GLSL segítségével, és meszorozzuk az eredeti _RGB_-t a saját _matrixunkkal_, majd hozzáadjuk az offsetet
```c
vec3 mixedColor = (u\_colorMatrix \* originalColor.rgb) + u\_offset;
```
Ezekután normalizálunk, hogy a százalékok miatt minden jó legyen ezt a _clamp()_-val tesszük _0.0_ és _1.0_ között tesszük meg

Ezek után pedig csak visszaadjuk a kész pixelt
```c
gl_FragColor = vec4(mixedColor, originalColor.a);
```
# Lábjegyzet:
Továbbiakban, késöbb jó lehet:
* [Vignette ](https://stack.gl/packages/#TyLindberg/glsl-vignette)
* [LUT](https://stack.gl/packages/#thibauts/parse-cube-lut)

**Utánanézni:** Hogyan tudnám megvalósítani ezeket WebGL, és BE-n?
  
* **Exposure, Brightness, Contrast**,
* ~~HSV (Hue, Saturation, Value)~~,
* ~~Levels (Shadows, Midtones, Highlights)~~,
* ~~Channel mixer~~
* **Vibrance** -> ehhez jön majd még a **shadow tint** és a **highlight tint**,
* **White Balance, Temperature, Tint**

# Források, használt anyagok:
* [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)
* [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)
* [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)
* [https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/](https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/)
---
_Megjegyzés: Gemini AI-t használtam, a források megértéséhez, az elmélet megértéséhez és elmagyarázásához. A Gemini-t mentorként használtam, hogy megértsem hogy mit fogok csinálni, és értsem a funkciók mögötti logikát, mivel célom nem a kód generáltatása._
