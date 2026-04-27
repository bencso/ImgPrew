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

[!image](https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/HSV\_color\_solid\_cone\_chroma\_gray.png/250px-HSV\_color\_solid\_cone\_chroma\_gray.png)

#### Hue
Megmondja a szöget, a **színtér hengerén,** amely **meghatározza a színt**, **0-360** fok között változik
**0-60** piros, **60-120** sárga, **120-180** zöld, **180-240** cyan, **240-300** kék, **300-360** magenta

#### Saturation
A telítettség értéke megmondja, hogy mennyi színmennyiséget kell hozzááadni, 100%nál azt jelenti hogy teljes "tiszta" színt adnak hozzá, míg 0%nál szürkeárnyalat lesz.

#### Value
A **Saturation** fényerőt adja, a 0 érték teljes **fekete sötétség,** míg a 100 teljes **fényerőt** jelent, illetve ez függ a **telítettségtől**.

##### Kódolás / Megoldás

Elsősorban **RGB** -> **HSV**-t kell implementálni:

* R' G' B'
&#x20;	R / alpha
&#x09;G / alpha
&#x09;B / alpha
Cmax = max(R',G',B')
Cmin = min(R',G',B')
Δ = Cmax-Cmin


###### Hue

Három eset van, ha a Cmax az egyenlő **R'**-rel, vagyis az **R'** a legnagyobb akkor
60deg \* ((G'-B')/Δ mod (%) 6)

Ha a **G**
60deg \* ((B'-R')/Δ + 2)

Ha a **B**
60deg \* ((R'-G')/Δ + 4)

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

Ha **0**, akkor a Saturation is 0
Különben pedig:
Δ/Cmax

###### Value

**Value = Cmax**

###### **GSLS-ben**

```glsl
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
```

> **-1/3** és a **2/3** eltolások a *color wheel* miatt kell

```glsl
vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
```

> Összehasonlítja a **b** és **g** értékekekt, és rendezi az adatokat **(Maximum kiválasztás)**

```glsl
vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
```

> Összehasonlítja a \*\*p\*\* és \*\*r\*\* értékeket, és rendezi az adatokat \*\*(Maximum kiválasztás még egyszer)\*\* => *p* rendezés, majd *q* rendezés

```glsl
float d = q.x - min(q.w, q.y);

```

> legnagyobb és legkisebb különbség => ez lesz a **telítettség**

```glsl
float e = 1.0e-10;
```

> ne lehessen nullával osztani

*Hue*

```glsl
abs(q.z + (q.w - q.y) / (6.0 \* d + e))
```

> szín a színkörön hol van

*Saturation*

```glsl
d / (q.x + e)
```


> ha nincs különbség a komponensek között => 0 -> szürke
> ha nagy különbség => élénk szín

---

```glsl
vec3 rgb2hsv(vec3 c) {
&#x20;   vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);

&#x20;   vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
&#x20;   vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

&#x20;   float d = q.x - min(q.w, q.y);
&#x20;   float e = 1.0e-10;

&#x20;   return vec3(abs(q.z + (q.w - q.y) / (6.0 \* d + e)), d / (q.x + e), q.x);

}

```

### Levels

### Channel Mixer


### Források:

* [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)
* [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)
* [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)

