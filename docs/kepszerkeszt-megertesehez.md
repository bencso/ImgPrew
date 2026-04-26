# LUT (Look Up Table)  
  
Milyen szín bemenethez -> milyen szín kimenet megy.  
  
**Tulajdonképpen egy:** bemeneti-kimeneti mátrix -> *színek, világosság, kontraszt, szaturáció….*   
**Fájlformátum:** .cube  
  
A legjobb, ha **LUT** készítéshez, LOG formátumú *(nyers)* fényképet használunk, mert ezen láthatóak jól a színek és a kontrasztok *("kicsit szürkés kép")*  
  
### Beállítások  
  
### Színkorrekció  
  
A Color correction *(vagyis színkorrekció)* esetén állítjuk be az alábbiakat:  
  
- **fehéregyensúly**  
- **expozíció**  
- **kontraszt**  
  
A kép "normális" kinézetének megalkotása  
  
### Színosztályzás / Fényelés  
  
A Color grading *(vagyis fényelés)* esetén az alábbi kép tulajdonságokat állíthatjuk:  
  
- **árnyékok *(shadows)***  
- **középtónusok *(midtonees)***  
- **csúcsfények *(highlights)***  
  
*Lightroom*-os működés [(kép)](https://halado.fotokonyv.hu/wp-content/uploads/2021/09/2021-09-24_19-51-48.jpg):  
  
- Egy *"színes kör/kerék"*  
- Sliderek (HSL)  
  
### *Kerék (ez kihagyható -> helyette elég csak a HSL sliderek)*  
  
A kerékben egy kezelő van, a kezelő a **telítettséget** szabályozza  
  
- középpontól való távolság a telítettséget változtatja -> ha középen van telítettség **nulla *(nincs színárnyalat)*** -> ha a szélén van akkor **100**  
  
***=> minél szélibb van annál nagyobb érték***  
  
### *Slider (HSL)*  
  
A **színárnyalatot**, vagyis **HSL értékeket** lehet vele szabályozni:  
  
H -> ***Hue*:** <i>színezettség</i>  
  
S -> ***Saturation*:** <i>szín telítettség</i>  
  
L -> ***Luminance*:** <i>szín sötétség</i>  
  
- ***Tulajdonképpen a kerékkel ezeket állítjuk, "jobban látható kerékkel" hogy mi is történik, de ezeket az értékeket (H,S,L) változtatja ő is***  
  
### *Blending, Balance*  
  
**Blending** felel a *színek közötti átfedéséért* (közép érték -> 0 - 50 - 100)  
  
- Balra vagyis a 0 felé közelítve:  
    - Színek kevésbé keverednek  
  
- Jobb vagyis 100 felé közelítve:  
    - Jobban keverednek  
  
**Balance** pedig meghatározza, melyik **fényerőtartomány** legyen **dominánsabb** (közép érték -100 - 0 - 100)  
  
- Balra húzva:  
    - Árnyékhoz rendelt szín átmegy a *csúcsfénybe, középtónusokba (mit is jelent ez valójában?)*  
  
- Jobbara húzva:  
    - *Csúcsfény* veszi át a vezetést  
  
  
### HSV  
  
### Levels  
  
### Channel Mixer  
  
  
### Lift, Gamme, Gain -> ezt ki lesz hagyva …. (Ennek utoljára utánanézni, csak kíváncsiságból - ez too much már)  
  
Lift, Gamma, Gain színkerekek, **színkorrekciókra **lettek kitalálva.   
  
- **Lift (sötét tónusok) **-> “whites”  
- **Gamma (középtónus) **-> “black”  
- **Gain (fények) **-> teljes színárnyalat spektrumon állítunk  
- **Offset (teljes kép)**  
  
RGB görbe:  
*-> **Átlós tengely:***  
	- Bal alsó: sötét pontok  
	- Jobb felső: fehér pontok  
-> ***Függőleges****:* színek fényereje  
-> ***Vízszintes****: *Színtónus szabályozásra  
  
  
### Lábjegyzet:  
- **Utánanézni:** Hogyan tudnám megvalósítani ezeket WebGL, és BE-n?  
  
**Amik *(a külön szekcióban)* lehetnének, mert talán megvalósítható utánajárás után, szerintem:**  
- Exposure, Brightness, Contrast* (ezek alapból vannak is, és lesznek is….annyi hogy lehet WebGL megoldással)*  
- HSV (Hue, Saturation, Value, Vibrance) -> ehhez jön a **shadow tint **és a **highlight tint **-> [https://www.geeksforgeeks.org/computer-graphics/hsv-color-model-in-computer-graphics/](https://www.geeksforgeeks.org/computer-graphics/hsv-color-model-in-computer-graphics/)  
- Levels (Shadows, Midtones, Highlights) -> [https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/](https://lifeafterphotoshop.com/shadows-midtones-and-highlights-explained/)  
- Channel mixer -> [https://www.tourboxtech.com/en/news/channel-mixer.html](https://www.tourboxtech.com/en/news/channel-mixer.html)  
  
### Források:  
  
- [https://halado.fotokonyv.hu/color-grading/ ](https://halado.fotokonyv.hu/color-grading/)   
- [https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve](https://www.capcut.com/hu-hu/resource/color-grading-in-davinci-resolve)  
- [https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/](https://crewinmotion.com/what-you-need-to-know-about-color-grading-for-beginners/)  
