<a id="top"></a>

<div align="center">

![version](https://img.shields.io/badge/verzió-v0.1-black?style=for-the-badge)
![status](https://img.shields.io/badge/státusz-folyamatban-blue?style=for-the-badge)
![target](https://img.shields.io/badge/Cél-2026%20Q2-red?style=for-the-badge)

</div>

<div align="center">
  <h1>ImgPrew</h1>
  <p><em>Fotós workflow eszköz: EXIF adatok kinyerése és manipulálása, képszerkesztés és közösségi médiára felkészítés egy helyen.</em></p>
  <p align="center">
    <a href="#roadmap">Roadmap</a> | 
    <a href="#technológiák">Technológiák</a> | 
    <a href="#közreműködés">Közreműködés</a> |
    <a href="https://github.com/bencso/ImgPrew/tree/develop">Develop branch</a>
  </p>
</div>

---

## Vízió

> **Cél:** Egyszerűsíteni a fotósok közösségi média munkafolyamatát anélkül, hogy profi képszerkesztő szoftvert kellene használni.

Az **ImgPrew** lehetővé teszi, hogy a fotósok gyorsan készítsenek *közösségi médiára felkészített* képeket, mindezt egy könnyen kezelhető webes felületen.

**Főbb funkciók:**

* Több fájl támogatás: `JPG`, `PNG`, `HEIC`
* `EXIF` adat kinyerés és caption generálás
* Testreszabható vízjelek és szöveg elhelyezés
* Fényerő, Kontraszt, Saturation, Exposure állítás
* LUT kezelések
* Kép optimalizálás közösségi médiára

<p align="right"><a href="#top">Vissza a tetejére</a></p>

---

## Technológiák

|     Terület     |                           Technológia                           |                     Miért?                     |
|:---------------:|:---------------------------------------------------------------:|:---------------------------------------------:|
| *Frontend*      | ![nextjs](https://www.readmecodegen.com/api/social-icon?name=nextjs&size=40&shape=circle&reverseBackground=true&textAlignment=horizontal&showText=true&textColor=%237e7f7f) | Gyors, reszponzív UI komponensek React alapokon |
| *UI library*    | ![chakraui](https://www.readmecodegen.com/api/social-icon?name=chakraui&size=40&shape=circle&reverseBackground=true&textAlignment=horizontal&showText=true&textColor=%237e7f7f) |  |
| *Backend*       | ![fastapi](https://www.readmecodegen.com/api/social-icon?name=fastapi&size=40&shape=circle&reverseBackground=true&textAlignment=horizontal&showText=true&textColor=%237e7f7f) | Modern Python REST API, gyors és skálázható     |
| *Architektúra*  | ![docker](https://www.readmecodegen.com/api/social-icon?name=docker&size=40&shape=circle&reverseBackground=true&textAlignment=horizontal&showText=true&textColor=%237e7f7f) | Könnyen telepíthető, konténerezett környezet    |

<p align="right"><a href="#top">Vissza a tetejére</a></p>

---

## Roadmap

```mermaid
timeline
    title Projekt ütemezés

    section MVP (Konzolos prototípus)
        Több fájl támogatás (JPG, PNG, HEIC) : kész
        EXIF adat kinyerés és caption generálás : kész
        Kép méret optimalizálás közösségi médiára : kész
        Testreszabható vízjel : kész
        Kép szerkesztési funkciók : kész
        LUT kezelések : kész

    section Webalkalmazás
        Drag&drop feltöltés : kész
        Kép szerkesztési funkciók : kész
        Vízjel pozíció és méret kezelése : kész
        Szöveg elhelyezése a képen : folyamatban
        Kép szerkesztési előnézet : folyamatban
        FastAPI REST API kialakítása : folyamatban

    section Haladó funkciók
        Saját galéria létrehozása : tervezett
        Saját térkép készítése feltöltött képekhez : tervezett
        Felhasználói authentikáció (OAuth2) : tervezett
```

**Kiemelet feature táblázat**

| Funkció                                  | Státusz        |
| ---------------------------------------- | -------------- |
| EXIF kinyerés                            | ✅ kész         |
| Caption generálás                        | ✅ kész         |
| Vízjel pozíció/méret                     | ✅ kész         |
| Kép szerkesztés (fényerő/kontraszt/stb.) | ✅ kész         |
| Szöveg elhelyezése a képen               | ⚠️ folyamatban |
| LUT kezelések                            | ⏳ tervezett    |
| Saját galéria                            | ⏳ tervezett    |
| Saját térkép                             | ⏳ tervezett    |
| Authentikáció (OAuth2)                   | ⏳ tervezett    |

<p align="right"><a href="#top">Vissza a tetejére</a></p>

---

## Közreműködés

A projekt jelenleg **fejlesztés alatt** áll, ezért külső hozzájárulás még nem elérhető.

**Későbbiekben**:

* PR-ek fogadása
* Hibajelentés és feature javaslatok
* `CONTRIBUTING.md` dokumentáció

<p align="center">
  <img src="https://contrib.rocks/image?repo=bencso/ImgPrew" />
</p>

<p align="right"><a href="#top">Vissza a tetejére</a></p>
