# **LUT (Look Up Table)**

Milyen szín bemenethez -> milyen szín kimenet megy.

**Tulajdonképpen egy:** bemeneti-kimeneti mátrix -> *színek, világosság, kontraszt, szaturáció….*
**Fájlformátum:** .cube

A legjobb, ha **LUT** készítéshez, LOG formátumú *(nyers)* fényképet használunk, mert ezen láthatóak jól a színek és a kontrasztok *("kicsit szürkés kép")*

### **Beállítások**

#### **Színkorrekció**

A Color correction *(vagyis színkorrekció)* esetén állítjuk be az alábbiakat:

* **fehéregyensúly**
* **expozíció**
* **kontraszt**

A kép "normális" kinézetének megalkotása

#### **Színosztályzás / Fényelés**

A Color grading *(vagyis fényelés)* esetén az alábbi kép tulajdonságokat állíthatjuk:

* **árnyékok *(shadows)***
* **középtónusok *(midtonees)***
* **csúcsfények *(highlights)***

*Lightroom*-os működés [(kép)](https://halado.fotokonyv.hu/wp-content/uploads/2021/09/2021-09-24_19-51-48.jpg):

* Egy *"színes kör/kerék"*
* Sliderek (HSL)

##### *Kerék (ez kihagyható -> helyette elég csak a HSL sliderek)*

A kerékben egy kezelő van, a kezelő a **telítettséget** szabályozza 

* középpontól való távolság a telítettséget változtatja -> ha középen van telítettség **nulla *(nincs színárnyalat)*** -> ha a szélén van akkor **100** 

***=> minél szélibb van annál nagyobb érték***

###### *Slider (HSL)*

A **színárnyalatot**, vagyis **HSL értékeket** lehet vele szabályozni:

H -> ***Hue*:** <i>színezettség</i>

S -> ***Saturation*:** <i>szín telítettség</i>

L -> ***Luminance*:** <i>szín sötétség</i>

* ***Tulajdonképpen a kerékkel ezeket állítjuk, "jobban látható kerékkel" hogy mi is történik, de ezeket az értékeket (H,S,L) változtatja ő is***
  
###### *Blending, Balance*

**Blending** felel a *színek közötti átfedéséért* (közép érték -> 0 - 50 - 100) 

* Balra vagyis a 0 felé közelítve:

  * Színek kevésbé keverednek
* Jobb vagyis 100 felé közelítve:

  * Jobban keverednek


**Balance** pedig meghatározza, melyik **fényerőtartomány (^1)** legyen **dominánsabb** (közép érték -100 - 0 - 100)

* Balra húzva:

  * Árnyékhoz rendelt szín átmegy a *csúcsfénybe, középtónusokba (mit is jelent ez valójában?)*
* Jobbara húzva:

  * *Csúcsfény* veszi át a vezetést


##### Lábjegyzet:
- Lift, Gamma, Gain, Offset után nézni, mit állítm hogyan?
- **Utánanézni:** Hogyan tudnám megvalósítani ezeket WebGL, és BE-n?

##### Források:

* [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)
  *-> eddig felhasznált*
* [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)
* [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)

