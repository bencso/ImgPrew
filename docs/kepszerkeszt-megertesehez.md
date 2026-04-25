# **LUT (Look Up Table)**

Milyen szín bemenethez -> milyen szín kimenet megy.

**Tulajdonképpen egy:** bemeneti-kimeneti mátrix -> _színek, világosság, kontraszt, szaturáció…._
**Fájlformátum:** .cube

A legjobb, ha **LUT** készítéshez, LOG formátumú _(nyers)_ fényképet használunk, mert ezen láthatóak jól a színek és a kontrasztok _("kicsit szürkés kép")_

### **Beállítások**

#### **Színkorrekció**

A Color correction _(vagyis színkorrekció)_ esetén állítjuk be az alábbiakat:

- **fehéregyensúly**
- **expozíció**
- **kontraszt**

A kép "normális" kinézetének megalkotása

#### **Színosztályzás / Fényelés**

A Color grading _(vagyis fényelés)_ esetén az alábbi kép tulajdonságokat állíthatjuk:

- **árnyékok _(shadows)_**
- **középtónusok _(midtonees)_**
- **csúcsfények _(highlights)_**

_Lightroom_-os működés [(kép)](https://halado.fotokonyv.hu/wp-content/uploads/2021/09/2021-09-24_19-51-48.jpg):

- Egy _"színes kör/kerék"_
- Sliderek (HSL)

##### _Kerék (ez kihagyható -> helyette elég csak a HSL sliderek)_

A kerékben egy kezelő van, a kezelő a **telítettséget** szabályozza

- középpontól való távolság a telítettséget változtatja -> ha középen van telítettség **nulla _(nincs színárnyalat)_** -> ha a szélén van akkor **100**

**_=> minél szélibb van annál nagyobb érték_**

###### _Slider (HSL)_

A **színárnyalatot**, vagyis **HSL értékeket** lehet vele szabályozni:

H -> **_Hue_:** <i>színezettség</i>

S -> **_Saturation_:** <i>szín telítettség</i>

L -> **_Luminance_:** <i>szín sötétség</i>

- **_Tulajdonképpen a kerékkel ezeket állítjuk, "jobban látható kerékkel" hogy mi is történik, de ezeket az értékeket (H,S,L) változtatja ő is_**

###### _Blending, Balance_

**Blending** felel a _színek közötti átfedéséért_ (közép érték -> 0 - 50 - 100)

- Balra vagyis a 0 felé közelítve:
  - Színek kevésbé keverednek

- Jobb vagyis 100 felé közelítve:
  - Jobban keverednek

**Balance** pedig meghatározza, melyik **fényerőtartomány (^1)** legyen **dominánsabb** (közép érték -100 - 0 - 100)

- Balra húzva:
  - Árnyékhoz rendelt szín átmegy a _csúcsfénybe, középtónusokba (mit is jelent ez valójában?)_

- Jobbara húzva:
  - _Csúcsfény_ veszi át a vezetést

##### Lábjegyzet:

- Lift, Gamma, Gain, Offset után nézni, mit állítm hogyan?
- **Utánanézni:** Hogyan tudnám megvalósítani ezeket WebGL, és BE-n?

##### Források:

- [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)
  _-> eddig felhasznált_
- [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)
- [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)
