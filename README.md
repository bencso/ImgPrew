# ImgPrew 📸

> Fotó előkészítő eszköz fotósoknak - EXIF adatok kinyerés, vízjel hozzáadás, és képek felkészítése közösségi médiára stílusosan, akár képek feltöltése.

## 🎯 Projekt célja

Egy webalkalmazás, amely segít a fotósoknak egyszerűsíteni a közösségi média munkafolyamatot: automatikusan kinyeri a kamera beállításokat (EXIF adatok), testreszabható vízjeleket ad hozzá, és akár formázza a képeket közösségi médiára - mindezt egy helyen.

## ✨ Funkciók

### MVP

- ✅ Több fotó feltöltése (JPG, PNG, HEIC támogatás)
- ✅ Automatikus EXIF adat kinyerés
  - Kamera típus és gyártó
  - Objektív információk
  - ISO, rekesz, záridő
  - Fókusztávolság
  - Készítés dátuma
- Beállítások formázása Instagram captionhöz
- Egyedi caption sablonok
- ✅ Instagram formátum optimalizálás (1:1, 4:5, 9:16)

### Tervezett funkciók

- Vizuális fotógaléria kiválasztással (FRONTEND)
- ✅ Kiválasztható mely EXIF mezők jelenjenek meg (✅BACKEND -> FRONTEND)
- Testreszabható vízjel elhelyezés (FRONTEND/ _(in progress)_ BACKEND)
  - Pozíció (sarkok, középen, egyedi)
  - Átlátszóság beállítás
  - Méret módosítás
  - Saját logó/szöveg feltöltés
- Kötegelt feldolgozás
- Export beállítások mentése
  - Végén: hasheléses módszerrel tárolhatjuk, és ezeket meg lehet osztani is majd akár
- Előtte/Utána előnézet csúszka
- Egy kattintásos letöltés

### Jövőbeli ötletek

- 📱 Blogszerűen feltöltés a saját weboldalra
- 🎨 Egyedi presetek
- 🔗 Közvetlen Instagram/Közösségi oldal API integráció *(feltöltés)*

## 🛠️ Technológiák

### Backend

- Python 3.14.2
- FastAPI (REST API) _(amennyiben API-ra változtatjuk)_
- PIL/Pillow (EXIF olvasás)
- OpenCV (képfeldolgozás, vízjelek)
- SQLite / PostgreSQL _(még kérdéses, hogy lokalisan tudják a userek futtatni, vagy legyen futtatva, ennek függvényében lesz ez eldöntve)_

### Frontend

- NextJS
- TailwindCSS
- shadcn

### További könyvtárak

- `pillow-heif` (HEIC támogatás)
- `python-multipart` (fájl feltöltés FastAPI-ban)

## 💡 Miért ez a projekt?

A fotózás az egyik hobbim, és amikor projekt ötleteken gondolkoztam, rájöttem egy valós problémára: Instagram-on szeretném megosztani a fotóimat, de mindig macerás manuálisan begépelni a kamera beállításokat (ISO, rekesz, záridő) minden egyes képhez.

Első gondolatom a [Flickr](https://www.flickr.com/) volt, ahol automatikusan megjelennek az EXIF adatok, de miért használnék egy kész platformot, amikor magam is megépíthetem? Így született az ImgPrep ötletem - egy eszköz, ami automatizálja ezt a folyamatot, vízjelet tesz a képekre, és optimalizálja őket a közösségi platformokra.

Ez a projekt egyszerre praktikus és remek tanulási lehetőség full-stack fejlesztésben.

## 🤝 Közreműködés

Ez egy tanulási projekt, amíg nem növi ki magát, de javaslatokat és visszajelzéseket mindig szívesen fogadok! Nyugodtan nyiss issue-t vagy küldj PR-t.

## 📄 Licensz

MIT License - Szabadon használható és módosítható

---

## 🏁 Első lépések

> Hamarosan - A telepítési útmutató hozzáadásra kerül amint az MVP elkészül.

---

**Státusz:** 🚧 Aktív fejlesztés alatt  
**Indulás:** 2026. január

---

## 💭 Megjegyzések

Ez a projekt része a full-stack fejlesztés tanulásának Python és NextJS használatával.

---

**⭐ Ha tetszik a projekt és az ötlet, örülök egy csillagnak :D**
