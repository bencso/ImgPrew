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
---
config:
  look: handDrawn
  layout: elk
---
flowchart LR
 subgraph MVP["<br>"]
        m1["Több fájl támogatás - JPG, PNG, HEIC"]
        m2["EXIF + caption generálás"]
        m3["Kép méret optimalizálás"]
        m4["Testreszabható vízjel"]
        m5["Kép szerkesztés"]
        m6["LUT kezelések"]
  end
 subgraph WEB["<br>"]
        w1["Drag & Drop feltöltés"]
        w2["Kép szerkesztés"]
        w3["Vízjel pozíció/méret"]
        w4["Szöveg elhelyezés"]
        w5["Előnézet"]
        w6["FastAPI API\nfolyamatban"]
  end
 subgraph ADV["</br>"]
        a1["Saját galéria"]
        a2["Térkép képekhez"]
        a3["OAuth2 auth"]
  end
    Start["Projekt indulás"] --> MVP
    MVP --> WEB
    WEB --> ADV
    ADV --> End(["Release"])

    Start@{ shape: terminal}
    style MVP fill:#C8E6C9,color:#00C853
    style WEB fill:#FFE0B2
    style ADV fill:#FFCDD2
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

## Architektúra 

> [!NOTE]
> Ez a felépítés még tervezés alatt van, ez csak egy gondolati ábra, így lehet nem a legjobb megoldás....

```mermaid
---
config:
  look: handDrawn
---
flowchart LR
 subgraph Frontend["Frontend"]
        NextJS["Next.js App"]
  end
 subgraph Backend["Backend"]
        API["Python FastAPI"]
  end
 subgraph s1["Adatbázis"]
        Postgres[("PostgreSQL")]
  end
 subgraph s2["Tárolás"]
        FájlTárolás["Docker Volume"]
  end
 subgraph subGraph4["Docker Hálózat"]
        Nginx["Nginx Reverse Proxy + Statikus szerverek"]
        Frontend
        Backend
        s1
        s2
  end
    User["Felhasználó / Böngésző"] -- HTTP/HTTPS --> Nginx
    Nginx -- / --> NextJS
    Nginx -- /api --> API
    Nginx -- /images --> FájlTárolás
    API -- ORM --> Postgres
    API -- Fájl mentés / olvasás --> FájlTárolás
    NextJS -- API hívások --> API

    FájlTárolás@{ shape: db}
```

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
