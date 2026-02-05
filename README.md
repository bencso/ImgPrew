# ImgPrew 📸

> Fotó workflow eszköz fotósoknak - EXIF adatok kinyerés, vízjel hozzáadás, és képek felkészítése közösségi médiára stílusosan.

> [!important]
> Fontos, ezzel az alkalmazással nem fogsz tudni kiváltani egy PROFI képszerkesztőt (mint például a Lightroom), de fotóidat, vagy szerkesztett képeidet fel tudod készíteni a közösségi médiára való feltöltésre.

## 🎯 Projekt célja

Egy webalkalmazás, amely segít a fotósoknak egyszerűsíteni a közösségi média munkafolyamatot: automatikusan kinyeri a kamera beállításokat (EXIF adatok), testreszabható vízjeleket ad hozzá, és formázza a képeket közösségi médiára - mindezt egy helyen.

## ✨ Funkciók

### MVP ✅ **KÉSZ** (Console prototípus működik)

- ✅ Több fotó feltöltése (`JPG`, `PNG`, `HEIC` támogatás)
- ✅ Automatikus EXIF adat kinyerés
  - Kamera típus és gyártó
  - Objektív információk
  - ISO, rekesz, záridő
  - Fókusztávolság
  - Készítés dátuma
  - Lokáció
- ✅ Beállítások formázása Instagram captionhöz
- ✅ Instagram formátum optimalizálás (1:1, 4:5, 9:16)
- ✅ Kiválasztható mely EXIF mezők jelenjenek meg
- ✅ Testreszabható vízjel elhelyezés
  - ✅ Pozíció (sarkok, középen, egyedi)
  - ✅ Átlátszóság beállítás
  - ✅ Méret módosítás
  - ✅ Saját logó/szöveg feltöltés
- ✅ LUT kezelések a képekre (`.cube` kiterjesztés)

### 🚀 **Következő fázis: Webalkalmazás átépítés**

**FastAPI + WebSocket alapú architektúra**

```
Console MVP → FastAPI REST API → WebSocket real-time UI
```

### Tervezett funkciók

- Real-time feldolgozási visszajelzések
- Webes drag&drop fájlfeltöltés
- Élő előnézetek
- Egyidejű több kép feldolgozás
- Vizuális fotógaléria kiválasztással (NextJS)
- Kötegelt feldolgozás → ZIP letöltés
- Előtte/Utána előnézet csúszka
- Export presetek mentése és megosztása

### Jövőbeli ötletek

- 📱 Saját Portfolió weboldal létrehozásnak a lehetősége _(Amint elkészült a kép töltheti fel a saját galériájába)_
- 🗺️ Képek elhelyezése térképen _(hol jártunk, emlékek oldal)_ _(elkezdve, kialakítása folyamatban)_
  - OpenStreetMap és az EXIF adatok _(ha nincs exif adat, manuálisan megadni a helyszínt)_ segítségével helyezhetjük el a térképre emlékeinket/képeinket
- 🎨 Egyedi presetek
- 🖼️ Nagyobb képszerkesztési funkciók bevezetése (Curves, Masking, ...) - amelyeket nagyobb képszerkesztő alkalmazások is tudnak
- 🔗 Közvetlen Instagram/Közösségi oldal API integráció _(feltöltés)_
  -> _META API általi korlátozás:_ csak Business Account-os felhasználók tudnak postolást végezni API-n keresztül
  -> Pinterest (?)

## 🛠️ Technológiák

### Backend **(Átépítés alatt)**

```
FastAPI + WebSocket
│
├── PIL/Pillow (EXIF + képfeldolgozás)
├── OpenCV (vízjelek, LUT-ok)
├── pillow-heif (HEIC)
└── PostgreSQL (presetek, felhasználók)
```

### Frontend **(Tervezés alatt)**

```
NextJS + App Router
├── TailwindCSS + shadcn/ui
└── Framer Motion
```

## 🔄 **Jelenlegi állapot**

```
✅ MVP core logika
✅ EXIF parser + vízjel + LUT
✅ Caption generátor

⏳ FastAPI + WebSocket átépítés
⏳ NextJS frontend fejlesztés
```

## 💡 Miért ez a projekt?

A fotózás az egyik hobbim, és amikor projekt ötleteken gondolkoztam, rájöttem egy valós problémára: Instagram-on szeretném megosztani a fotóimat, de mindig macerás manuálisan begépelni a kamera beállításokat (ISO, rekesz, záridő) minden egyes képhez.

Első gondolatom a [Flickr](https://www.flickr.com/) volt, ahol automatikusan megjelennek az EXIF adatok, de miért használnék egy kész platformot, amikor magam is megépíthetem? Így született az ImgPrep ötletem - egy eszköz, ami automatizálja ezt a folyamatot, vízjelet tesz a képekre, és optimalizálja őket a közösségi platformokra.

Ez a projekt egyszerre praktikus és remek tanulási lehetőség full-stack fejlesztésben.

## 🤝 Közreműködés

Ez egy tanulási projekt, amíg nem növi ki magát, de javaslatokat és visszajelzéseket mindig szívesen fogadok! PR-ek, issue-k, ötletek mindig szívesen látottak.

## 📄 Licensz

MIT License

***

## 🏁 MVP telepítése

```bash
git clone [repo]
cd imgprew
pip install -r requirements.txt
python main.py
```

**Web verzió demó:** Hamarosan

***

**Státusz:** 🚀 **FASTAPI + WS backendre való átépítés folyamatban**  
**Indulás:** 2026. január  

***

**⭐ Ha tetszik a projekt és az ötlet, örülök egy csillagnak! :D**