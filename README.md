<a id="top"></a>

<div align="center">
<p align="center">
  <img src="https://github.com/user-attachments/assets/5e1bb59d-78b2-4a1b-9b22-1979ac3526c6" alt="full logo" width="280" />
</p>
  <h2>Gyorsítsd fel a fotós workflow-d!</h2>
  <p><em>EXIF adatok kinyerése és manipulálása, képszerkesztés és közösségi médiára felkészítés egy helyen.</em></p>
<p align="center">
  <a href="#technológiák">Technológiák</a> | 
  <a href="#roadmap">Roadmap</a> | 
  <a href="#architektúra">Architektúra</a> |
  <a href="#screenshot">Screenshot</a> |
  <a href="#közreműködés">Közreműködés</a> |
</p>
</div>

---

## Vízió

> **Cél:** Egyszerűsíteni a fotósok közösségi média munkafolyamatát anélkül, hogy profi képszerkesztő szoftvert kellene használni.

Az **ImgPrew** lehetővé teszi, hogy a fotósok gyorsan készítsenek *közösségi médiára felkészített* képeket, mindezt egy könnyen kezelhető webes felületen.

### Főbb funkciók:

#### Feldolgozás
- JPG, PNG, HEIC támogatás
- EXIF → caption

#### Szerkesztés
- Fényerő / kontraszt / stb.
- LUT

#### Export
- Vízjel
- Szöveg
- Közösségi médiára optimalizálás

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
        a3["OAuth2 autentikáció"]
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

**Kiemelt feature táblázat**

| Funkció | Státusz |
|--------|--------|
| EXIF kinyerés | ✅ Kész |
| Caption generálás | ✅ Kész |
| Vízjel | ✅ Kész |
| Szerkesztés | 🟡 Folyamatban |
| LUT | ⬜ Tervezett |

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

<p align="right"><a href="#top">Vissza a tetejére</a></p>

---

## Screenshot

> [!WARNING]
> **BÉTA verzió (2026.03.21)** – hibák előfordulhatnak!

<img width="1566" height="990" max-width="100%" alt="Képernyőfotó 2026-03-21 - 7 58 08" src="https://github.com/user-attachments/assets/1644ff23-6e30-4ac8-ab52-2614138f68b7" />

</br>
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

---

<div align="center">
  
![verzio](https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=VERZI%C3%93&secondaryLabel=0.01&primaryBGColor=%2368bcd1&primaryTextColor=%23FFFFFF&secondaryBGColor=%23273b41&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=600&primaryLetterSpacing=2&primaryFontFamily=Montserrat&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=0&secondaryFontFamily=Verdana&secondaryTextTransform=uppercase)
&nbsp;
![statusz](https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=ST%C3%81TUSZ&secondaryLabel=FOLYAMATBAN&primaryBGColor=%2368bcd1&primaryTextColor=%23FFFFFF&secondaryBGColor=%23273b41&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=600&primaryLetterSpacing=2&primaryFontFamily=Montserrat&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=0&secondaryFontFamily=Verdana&secondaryTextTransform=uppercase)
&nbsp;
![celkituzes](https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=C%C3%89L+D%C3%81TUM&secondaryLabel=2026+Q2&primaryBGColor=%2368bcd1&primaryTextColor=%23FFFFFF&secondaryBGColor=%23273b41&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=600&primaryLetterSpacing=2&primaryFontFamily=Montserrat&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=0&secondaryFontFamily=Verdana&secondaryTextTransform=uppercase)

</div>
