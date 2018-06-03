---?image=https://raw.githubusercontent.com/travelfeed/travelfeed-app/develop/src/assets/images/header/header.png&size=contain&position=top

<div style="position: fixed; bottom: 7vh; left: -50%; width: 100vw; height: 80px;">
    <p style="font-size: 22px; text-align: center; font-weight: 100;">Dennis Fritsch | Pascal Iske | Ivan Nikic | Lars Wächter</p>
</div>

---

## Inhalt

@ul[squares]

- Einleitung
- Architektur
- Frontend
- Backend
- API

@ulend

---

## Einleitung

---

## Architektur

@ul[squares]

- App @fa[arrows-h] API
- TypeScript
- App: Angular v6
- API: ExpressJS mit Erweiterungen
- MySql Datenbank

@ulend

---

## Frontend

---

## Backend

- Pflege der Berichte
- Pflege der Übersetzungen
- Administration von allen Benutzeraccounts
- Aufruf über `http://localhost:4200/auth/signin`

---

## API

---?code=src/modules/article/models/article.model.ts&title=article.model.ts

@[20-34](Simple table columns)
@[51-63](Relations to other models / tables)

---?color=#000
