# LUT (Look Up Table)

Milyen szín bemenethez -> milyen szín kimenet megy.

**Tulajdonképpen egy:** bemeneti-kimeneti mátrix -> *színek, világosság, kontraszt, szaturáció….*
**Fájlformátum:** .cube

A legjobb, ha **LUT** készítéshez, LOG formátumú *(nyers)* fényképet használunk, mert ezen láthatóak jól a színek és a kontrasztok *("kicsit szürkés kép")*

### 

# Színkorrekció

A Color correction *(vagyis színkorrekció)* esetén állítjuk be az alábbiakat:

* **fehéregyensúly**
* **expozíció**
* **kontraszt**

A kép "normális" kinézetének megalkotása

# Exposure, Brightness, Contrast
Ez a három elengedhetetlen egy képszerkesztőben…

- **Exposure (Expozíció):** Ebben az esetben nem összeadunk, hanem *szorzunk*.
    - **Úgy viselkedik, mint a kamera lencséje:** ha növekszik akkor minden pixel arányosan több fényt kap, ez az *Fényérték* alapján számoljuk, ami *2-es alapú hatványozás ($2^{\text{exposure}}$)*.
  - **Brightness (Fényerő):** Sima *összeadás/kivonás*. Minden pixelhez lineárisan hozzáadunk egy értéket.
  - **Contrast (Kontraszt):** *Szorzás* egy pont *(szürke)* körül.
      - Kivonunk *0.5*-öt ezáltal a *sötétek negatívak lesznek, a világosak pozítivak*, ezt megszorozzuk a kontraszt értékével, majd visszaadunk hozzá amit elvettünk *(0.5)* => a *világos világosabb* a *sötét sötétebb* lesz
   
#### GLSL / WebGL 
A GPU-nak ezek a számítások nem „drága", így ezt általában egy shaderbe, egy filterbe szokták tenni.

3 sliderre van szükségünk:
1. **Exposure:** *-3* és *3* közötti érték *(alapértelmezett 0)*
2. **Brightness:** *-1* és *1* közötti érték  *(alapértelmezett 0)*
3. **Contrast:** *0* és *2*  (vagy több) közötti érték   *(alapértelmezett 1)*

Elsősorban megállapítjuk a textura eredeti pixeleit
`vec4 color = texture2D(uSampler, vTextureCoord); 
vec3 rgb = color.rgb;`

és ezek után a müveletek elvégezzük
- **Exposure** esetén az *rgb*-t megszorozzuk a ($2^{\text{exposure}}$)-val (itt érdemes a beépített *pow* fgv-t használni)
- **Brightness** esetén *rgb*-hez hozzáadjuk a *brightness*-t
- **Contrast** esetén pedig kivonjuk az *rgb*-ből a *0.5*-t, majd megszorozzuk a *contrast*-tal és visszaadjuk neki a *0.5*-t

Ezek után pedig normalizáljuk *(clamp-pal 0 és 1 közötti értékre)*
és átadjuk a *gl_FragColor*-nak egy *4vect* ként az erdeti alfával

# Színosztályzás / Fényelés

A Color grading *(vagyis fényelés)* esetén az alábbi kép tulajdonságokat állíthatjuk:

**árnyékok *(shadows)***
**középtónusok *(midtonees)***
**csúcsfények *(highlights)***

*Lightroom*-os működés [(kép)](https://halado.fotokonyv.hu/wp-content/uploads/2021/09/2021-09-24*19-51-48.jpg):

* Egy *"színes kör/kerék"*
* Sliderek (HSL)

### 

# Kerék (ez kihagyható -> helyette elég csak a HSL sliderek)

A kerékben egy kezelő van, a kezelő a **telítettséget** szabályozza

középpontól való távolság a telítettséget változtatja -> ha középen van telítettség **nulla *(nincs színárnyalat)*** -> ha a szélén van akkor **100**

***=> minél szélibb van annál nagyobb érték***

### 

# Slider (HSL)

A **színárnyalatot**, vagyis **HSL értékeket** lehet vele szabályozni:

H -> **Hue**: *színezettség*
S -> **Saturation**: *szín telítettség*
L -> **Luminance**: *szín sötétség*

* ***Tulajdonképpen a kerékkel ezeket állítjuk, "jobban látható kerékkel" hogy mi is történik, de ezeket az értékeket (H,S,L) változtatja ő is***

### 

# Blending, Balance

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

# Lift, Gamma, Gain -> ezt ki lesz hagyva …. (Ennek utoljára utánanézni, csak kíváncsiságból - ez too much már)

Lift, Gamma, Gain színkerekek, színkorrekciókra lettek kitalálva.

* Lift (sötét tónusok) -> “whites”
* Gamma (középtónus) -> “black”
* Gain (fények) -> teljes színárnyalat spektrumon állítunk
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

Egy kúp, ahol *piros-kék spektruma* **balról jobbra**, **középről** <-> **szélre** pedig az *intenzitás* növekszik
Alulról felfelé, pedig a fényerő nő.
Fehér a középső rétegben.

![image](https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/HSVcolorsolidconechromagray.png/250px-HSVcolorsolidconechromagray.png)

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
60^\circ \cdot \left( \frac{G' - B'}{\Delta} \bmod 6 \right), & \text{ha } C*{\max} = R' \\
60^\circ \cdot \left( \frac{B' - R'}{\Delta} + 2 \right), & \text{ha } C*{\max} = G' \\
60^\circ \cdot \left( \frac{R' - G'}{\Delta} + 4 \right), & \text{ha } C*{\max} = B'
\end{cases}
$$

###### Saturation

Itt két esetünk van, ha a Cmax 0 vagy nem nulla

Ha **0**, akkor a **Saturation is 0**
Különben pedig:
**Δ/Cmax**

###### Value

**Value = Cmax**

#### Számítás (Matematikai, megértéshez)

1. Esetlegesen: https://www.npmjs.com/package/glsl-hsv2rgb
```#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)```
2. Vagy az alábbi módon:
```vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);```
> **-1/3** és a **2/3** eltolások a *color wheel* miatt kell

```vec4 maxBG = mix(vec4(color.bg, K.wz), vec4(color.gb, K.xy), step(color.b, color.g));```
> Összehasonlítja a **b** és **g** értékekekt, és rendezi az adatokat **(Maximum kiválasztás)**

```vec4 maxPR = mix(vec4(maxBG.xyw, color.r), vec4(color.r, maxBG.yzx), step(maxBG.x, color.r));```
> Összehasonlítja a **p** és **r** értékeket, és rendezi az adatokat (Maximum kiválasztás még egyszer) => *p* rendezés, majd *q* rendezés

```float saturation = maxPR.x - min(maxPR.w, maxPR.y);```
> legnagyobb és legkisebb különbség => ez lesz a **telítettség**

```float e = 1.0e-10;```
> ne lehessen nullával osztani

*Hue:*
```abs(maxPR.z + (maxPR.w - maxPR.y) / (6.0  saturation + e))```
> szín a színkörön hol van

*Saturation:*
```saturation / (maxPR.x + e)```
> ha nincs különbség a komponensek között => 0 -> szürke
> ha nagy különbség => élénk szín

#### Kód (GPU barát) - rgbToHsv
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
#### Számítás (Matematikai, megértéshez)

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

####  Kód (GPU barát) - hsvToRgb
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

```vec3 rgb = v * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), s);```
> **fehér alap** => vec3(1.0)
> **színes** => clamp(p - 1, 0, 1)
> clamp, hogy 0-1 között legyen; 0 = **fekete**, 1 = **színes**

###### hsvToRgb alkalmazása
```c
vec3 rgb = hsvToRgb();
FragColor = vec4(rgb, 1.0);
```
# Levels
Histogram: Térkép, ami megmutatja hogy a fotón, *mennyi sötét, közepes és világos px* van

*A levels beállításával ezeket a pixeleket lehet "tologatni", mi tudjuk meghatározni hogy hol kezdődjöjn a fekete és a fehér a képen.*

- Alsó negyed: *Árnyékok*
- Közép: *Kiemelések*
- Felső negyed: *Midtones*

A Levels tulajdonképpen egy bemeneti pixelértéket kap, és képez belőle egy kimeneti értéket.

Három lépésből fog állni:
1. Normalizálás
2. Gamma korrekció (Midtones)
3. Output mappelése

### Árnyékok
> Black points - fekete pont

A kép legsötétebb pontjait lehet állítani a shadows-sal.

A slider *jobbra* húzása esetén, azt határozzuk meg, hogy az *ettől a pixeltől balra* lévő pixeleket *"teljesen feketévé tegyél"*

> Ha a kép szürkésnek tűnik, vagy lapos, és hiányozik belőle a fekete, akkor érdemes használni

### Kiemelések
> Highlights - fehér pont

A kép legvilágosabb pontjait állítja. *(csúcsfények)*

A slidert *balra* a közepe felé húzzuk, akkor mint az árnyékoknál ugyanazon metódus alapján, azt mondjuk meg, hogy az ettől a *pixeltől jobbra* lévő pixeleket *"teljes fehérré"* tegyünk

> Ha a kép túl sötét akkor érdemes használni, vagy ha a fehér színek szürkések.

### Középtónusok
> Midtones - Gamma

Az összes olyan színt és fényerőt állítja, ami nem az elöző két tartományba tartozik *(nem fekete és nem fehér)*

A slider mozgatásával, a közets tartományt tolja el világosabb vagy sötétebb irányba *(a fehér és a fekete marad)*

#### Számítás (Matematikai, megértéshez)

**8 bites képen (0-255 tartomány)**

**Bemeneti paraméterek:** *Black, White, Gamma, OutBlack, OutWhite*

OutBlack alapértelmezetten *0*, az OutWhite *255*

> Ha a Blacket növeljük, azzal a histogram bal szélét toljuk be.

> A White a felső korlát, ha ezt csökkentjük, akkor a világos szürkéket állítjuk be hogy elérjék a 255 fényerőt *(maximálisat)*

> Nem lineáris, mert akkor módosulna a fekte és a fehér is. Ez egy exponencális görbe. Legnagyobb váltzoást 128 értéknél fejti ki *(középen)*

**- Shadows és Highlights:**
A bemeneti pixel-t normalizáljuk, 0-1 tartományban, a **Black** és **White** alapján.
$$x{Norm} = \frac{x - InBlack}{InWhite - InBlack}$$
ha **x < Black** akkor xNorm = 0, ha **x > White** akkor xNorm = 1

**- Gamma / Midtones:**
A középtónus slider nem lineárisan mozgatja az értékeket, hanem hatványfüggvénnyel van. (Így lehet azt megoldani, hogy a tiszta fekete és a tiszta fehér ne változzon)

Így, ha gamma 1 => nincs változás
Ha gamma > 1 => kép világosodík
Különben ha gamma < 1 => kép sötétedik
$$x{Gamma} = (x{norm})^{1/\gamma}$$
**- Output levels**
Kimeneti tartományba visszahelyezzük az eredményt:
$$y = x{Gamma} \cdot (OutWhite - OutBlack) + OutBlack$$
#### Implementáció

Példa kép:

![Kép by photoshopessentials ](https://pe-images.s3.amazonaws.com/photo-editing/cc/tone-and-color/levels/gradient-missing-shadows.gif "Kép by photoshopessentials")

*5 sliderre lesz szükségünk:*
- Bemeneti sliderek *(3)*
      1. Fekete *(InputBlack)* => 0 <= InputBlack < InputWhite
      2. Szürke *(Gamma)* => 0.01 <= Gamma <= 9.99
              *=> alapértelmezett: 1.0*
      3. Fehér *(InputWhite)* => InputBlack < InputWhite <= 255
  - Kimeneti sliderek *(2)*
        1.  Fekete
             *=> alapértelmezett: 0*
        2.  Fehér
             *=> alapértelmezett: 255*
      
Mivel minden pixelre megkéne a hatványozást csinálni ezért ez a matematikai megoldás nem a legjobb…

Így LUT-tal lehet megoldani a legegyszerűbben a dolgot *(python esetében ezt fogjuk nagyvalószínűséggel használni)*

Ha *8 bit*-es képről beszélünk, akkor a max. érték 256 *($2^8$)* lehet…

1. Szóval mikor a slider változik a fenti képlet szerint, mind a 256 értékre kiszámoljuk
2. Ezt egy tömbben (LUT)-ba eltároljuk
3. A kép pixelein végigmegyünk és csak kiolvassuk az értéket a tömbböl (LUT)
4. És ezt utána csak a kép pixelein végig menve az R/G/B-t változtatjuk (*LUT[px[i + n]]*-> itt *n>3*)

#### PIXI.JS / WebGL implementáció
A WebGL-es megoldáshoz, Shadert ajánlott, mert így nem kell mindig újragenerálni a LUT-ot, hanem egyszerűen az 5 paramétert megadjuk a **GPU** számára Shader segítségével, és a videókártya számol utána a képlet alapján..

- Normalizálás *(clamp függvénnyel)*
- Gamma korrekció
- Output mappelése
- Majd ezt a shadert egy *PIXI.Filter*-ként példányosítjuk

# Channel Mixer
A fotók esetében, mindegyik pixel egy sor RGB értéket tartalmaz. A változtatáskor lényegében a px-ek RGB értékeinek megváltoztatását foglalják magukba, ugyanígy a Channel Mixer esetében.

A Channel Mixer a többi színkorrekciós eszközzel ellentétben nem hozzáaadnak, vagy elvesz egy adott színből, hanem az *eredeti pixelek színcsatornáit használja fel* egy új channel kiszámításához.

- **Kimeneti csatorna:** A kimeneti csatornába az *R/G/B*-t értékeket lehet választani, ezek kiválasztása esetén, azt választjuk ki hogy melyik csatornát szeretnénk módosítani, befolyásolni.

  Tegyük fel a kék csatornát választjuk, akkor a kimeneti csatorna slidereinél a kiválasztott csatorna *100%*-on lesz a többi alapértelmezetten *0%*.

> Ha változtatjuk tegyük fel a pirosat 50%-ra és az Output channel Green, akkor az RGB-nél  a G érték számítása így néz ki: *(R * R% + G * G% + B * B%)*

#### Számítás (matematikai)
A channel mixert a legegyszerűbb egy **mátrixszorzással** megoldani.

Minden **px** esetén három input van: R, G, B -> *0-255 közötti érték (8 bit esetén)*, illetve **offset** szokott lenni, ami a *világosságot* állítja
$$ \begin{bmatrix} R' \\\ G' \\\ B' \end{bmatrix} = \begin{bmatrix} c{RR} & c{RG} & c{RB} \\\ c{GR} & c{GG} & c{GB} \\\ c{BR} & c{BG} & c{BB} \end{bmatrix} \begin{bmatrix} R \\\ G \\\ B \end{bmatrix} + \begin{bmatrix} KR \\\ KG \\\ KB \end{bmatrix} $$
- Változók:
    - $c{XY}$: A százalékos értékek tizedestört formátumban *(100% = 1.0)*. Az első a *kimeneti*, a második a *bemeneti* csatorna. (Pl. $c{GR}$ a Green output csatorna és a Red slider értéke).
    - $KR$: Az eltolás értéke *(-255 és 255 közötti értékek)*

#### Implementálás
Három fő színre R/G/B-re külön külön létre kellene hozni 4 slidert 
R / G / B / Offset

És a *mátrixszorzásokat* elvégezzük  minden értékre, illetve az offsetet normalizáljuk *-255-255 *skáláról *-1.0-1.0*-ra

Ezekből az értékekből készítünk egy 1D-s tömböt (3x3 mátrix), és egy 3 elemü tömböt az Offsetnek. Ezeket a GLSL-nek *uniform* változóként adjuk, mert mindenegyes pixelre haználni kell majd. *(colorMatrix, offset)*

#### WebGL / GLSL

Az  eredeti színeket kiolvassuk a texturából *(texture2D segítségével)*
    -> *vec4* type-val: **R,G,B,A**: itt mindegyik érték *0.0* és *1.0* között
Mátrixszorzást alkalmazzuk a GLSL segítségével, és meszorozzuk az eredeti *RGB*-t a saját *matrixunkkal*, majd hozzáadjuk az offsetet
```vec3 mixedColor = (u_colorMatrix * originalColor.rgb) + uoffset;```
Ezekután normalizálunk, hogy a százalékok miatt minden jó legyen ezt a *clamp()*-val tesszük *0.0* és *1.0* között tesszük meg

Ezek után pedig csak visszaadjuk a kész pixelt
```gl_FragColor = vec4(mixedColor, originalColor.a);```

# White Balance, Temperature, Tint
### Fehéregyensúly (White Balance)
A fehéregyensúly célja, hogy a képen *amik a valóságban fehérek voltak, azok a fotón is* azok legyenek, *színeltolódás nélkül*.

A fényeknek/fényforrásoknak saját színük van. A kamera és az ember máshogy rögzíti a színes fényt, ezt szeretnénk ellensúlyozni a *Temperature* és a *Tint* segítségével

### Színhőmérséklet (Temperature)
Ez *Kék* - *Narancssárga* tengelyen mozog, melynek a fizikai mértékegysége a Kelvin ($K$) 

> A UI-nál a slider jobbra húzással *(értéknöveléssel)* tesszük melegebbé a képet, míg a fotózásban az *alacsonyabb Kelvin* érték a melegebb fényt jelzi.

> **Balra húzva (Hideg):** Növeljük a kék színeket, és csökkentjük a piros, sárgát.
> **Jobbra húzva (Meleg):** Növeljük a piros és zöldet *(ezzel adja a sárgát)*, és csökkentjük a kéket.
 
![Kép by expertphotography.com](https://expertphotography.com/img/2018/07/White-Balance-Chart.jpg "Kép by expertphotography.com")
### Árnyalat (Tint)
Ez *Zöld* - *Magenta (Bíbor)* tengelyen mozog.

> **Alkalmazása:** Olyan fényeknél, amik erős zöldes árnyalatot adnak a képnek, és nem lehet a *Színhőmérséklettel* javítani.

> **Balra húzva (Zöld):** Zöldet ad a képhez, és elvesz a magentából.
> **Jobbra húzva (Magenta):** Magentát ad a képhez *(piros + kék)*, és elvesz a zöldből.

### Számítás (Matematikai, megértéshez)
A GPU-s megjelnítés miatt, itt az „olcsóbb” megoldást alkalmazzuk, ami egy *RGB csatornás eltolás*, igazándiból.

#### Temperature ($T$)
Ha $T > 0$ *(Melegítés)*: Növeljük a *piros* csatornát és csökkentjük a *kék* csatornát.
Ha $T < 0$ *(Hűtés)*: Csökkentjük a *piros*-t, és növeljük *kék*-et.
$$R\_{new} = R + T \\
B\_{new} = B - T
$$
#### Tint ($t$)
Magenta a *piros* és a *kék*-ből jön létre, a *zöld* pedig ennek az ellentéte. Így a *Tint*-nél a *zöld* csatornát állítjuk.
Ha $t > 0$ *(Magenta)*: Csökkentjük
Ha $t < 0$ *(Zöld)*: Növeljük
$$G\_{new} = G - t$$
### Implementálás
Két bemeneti érték:
- **temperature** *(-1 és 1 között => normalizálva)*
- **tint** *(-1 és 1 között => normalizálva)*

Ezek után lekérjük a megszokott módon (`texture2d(uSampler, vTextureCoord)`) a színeket, és ezeknek az *r*/*g*/*b*-jét állítjuk megfelelően.

- Temperature:
    - r => `r + temperature`
    - b =>` b - temperature`

- Tint:
    - g => `g - tint`
 
  > Ajánlott a *Fényerő* megőrzése, amit lementünk és majd késöbb visszaszorozzuk, mert az RGB csatornák ilyen módbeli (direkt) módosítása, megváltoztathatja az általános fényerejét a képnek

Eredeti fényerő mentésének kódja:
`float originalLuminance = dot(texture2D(uSampler, vTextureCoord).rgb, vec3(0.299, 0.587, 0.114));`

#### Észlelési súlyozás
`vec3(0.299, 0.587, 0.114)`

- Az emberi szemben lévő receptorok zöld fényre érzékenyek, a pirosra közepesen, míg a kékre kevésbé. Szóval a zöldet érezzük nagyon világosnak, mig a tiszta kéket sötétnek. Ezek a számok ezt az arányt adják meg *(Ezeket az együtthatókat az ITU-R BT.601 szabvány határozza meg, amelyeket az analóg SDTV esetén alkalmaztva)*:

![Kép by videohelp forum](https://forum.videohelp.com/attachment.php?attachmentid=44363 "Kép by videhelp forum” "Kép by videohelp forum")
  
- **Zöld** a világosságérzetünk 59 százalékának felel meg =>* 0.587*
- **Piros** a 30 százalékának => *0.299*
- **Kék** mindössze a 11 százalékáért felel =>* 0.114*
> 0.299 + 0.587 + 0.114 = 1.0

A `dot` függvény a *GLSL beépített függvénye*, ez *két vektor azonos pozícióban levő elemeit szorozza össze* majd *összeadja az eredményeket*$Luminance = (R \cdot 0.299) + (G \cdot 0.587) + (B \cdot 0.114)$

> Erre azért van szükségünk, mert alapvetően a px eltolásoknál a kép elsötétülhet érzékszerveink számára.

Ezért kell **kimentenünk az alap fényerő állapotát** a képünknek, majd módosítás után *visszaszoroznunk az új RGB* értéket, úgy hogy az az **eredeti világosságával megegyezzen** Ezáltal **a színárnyalat változik, a fényerő nem**.
```c
float currentLuminance = dot(color, vec3(0.299, 0.587, 0.114));

color = color \* (originalLuminance / max(currentLuminance, 0.0001));
```

_(Ennek az elmélet szemléltetéséhez, Gemini csinált nekem egy interaktív kis "bemutatót", aminek a képét csatolom)_

![Kép amit a Gemini csinált](https://github.com/user-attachments/assets/223bd34f-c890-47b8-aeef-c6d5f8580665 "Kép amit a Gemini generált")


# Lábjegyzet:
Továbbiakban, késöbb jó lehet:
* [Vignette ](https://stack.gl/packages/#TyLindberg/glsl-vignette)
* [LUT](https://stack.gl/packages/#thibauts/parse-cube-lut)

**Utánanézni:** Hogyan tudnám megvalósítani ezeket WebGL, és BE-n?
  
* ~~Exposure, Brightness, Contrast~~,
* ~~HSV (Hue, Saturation, Value)~~,
* ~~Levels (Shadows, Midtones, Highlights)~~,
* ~~Channel mixer~~
* ~~White Balance, Temperature, Tint~~,
* **Vibrance** -> ehhez jön majd még a **shadow tint** és a **highlight tint**,

# Források, használt anyagok:
* [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)
* [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)
* [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)
* [https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/](https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/)
---
*Megjegyzés: Gemini AI-t használtam, a források megértéséhez, az elmélet megértéséhez és elmagyarázásához. A Gemini-t mentorként használtam, hogy megértsem hogy mit fogok csinálni, és értsem a funkciók mögötti logikát, mivel célom nem a kód generáltatása.*
