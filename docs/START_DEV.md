<a id="top"></a>

<div align="center">
<p align="center">
  <img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/b7e4ebc4-a290-4c5d-8c10-047d5ec3457d" />
</p>
  <h2>Gyorsítsd fel a fotós workflow-d!</h2>
  <p><em>EXIF adatok kinyerése és manipulálása, képszerkesztés és közösségi médiára felkészítés egy helyen.</em></p>
<p align="center">
  <a href="/README.md/#technológiák">Technológiák</a> |
  <a href="/README.md/##roadmap">Roadmap</a> |
  <a href="/README.md/##architektúra">Architektúra</a> |
  <a href="/docs/START_DEV.md"><strong>Első indítás (Fejlesztői)</strong></a> |
  <a href="/README.md/#screenshot">Screenshot</a> |
  <a href="/README.md/#közreműködés">Közreműködés</a> |
</p>
</div>

---

## Első indítás - Dev setup

### 0. GitHub Repository leklónozása

```bash
git clone https://github.com/bencso/WizPX.git
cd WizPX
```

### 1. `.env` fájlok létrehozása

```bash
cp ./db/.env.example ./db/.env
cp ./frontend/.env.example ./frontend/.env
cp ./backend/.env.example ./backend/.env
```

- Ezek után állítsd be az `.env` fájlok-ban a szükséges adatokat!

---

### 2. Build + indítás

```bash
docker compose -f compose.dev.yml up --build
```

- A `--build` mindig újraépíti a frontend és backend image-eket.
- Ha csak a kód változik, de a Dockerfile nem, elég lehet az alábbi parancs:

```bash
docker compose -f compose.dev.yml up
```

---

### 3. Elérés

| Szolgáltatás | URL                                                        |
| ------------ | ---------------------------------------------------------- |
| Frontend     | [http://localhost](http://localhost)                       |
| Backend API  | [http://localhost/api](http://localhost/api)               |
| pgAdmin      | [http://localhost:5050](http://localhost:5050)             |

> [!NOTE]
> pgAdmin login: `.env`-ben megadott felhasználó/jelszó.

---

### 4. Konténerek állapotának ellenőrzése

```bash
docker compose -f compose.dev.yml ps
docker compose -f compose.dev.yml logs -f
```

---

- Ha módosítod a Dockerfile-t, újra kell buildelni:

```bash
docker compose -f compose.dev.yml up --build
```

> [!NOTE]
> Kódfrissítéshez **volumes miatt** nem kell újra buildelni.

---

### Konténerek leállítása / újraindítása

```bash
# Leállítás és network törlés
docker compose -f compose.dev.yml down

# Csak újraindítás (network és volumes megmarad)
docker compose -f compose.dev.yml restart
```
