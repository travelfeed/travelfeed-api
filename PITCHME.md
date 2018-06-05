---?image=https://raw.githubusercontent.com/travelfeed/travelfeed-app/develop/src/assets/images/header/header.png&size=contain&position=top

<div style="position: fixed; bottom: 7vh; left: -50%; width: 100vw; height: 80px;">
    <p style="font-size: 22px; text-align: center; font-weight: 100;">Dennis Fritsch | Pascal Iske | Ivan Nikic | Lars Wächter</p>
</div>

---

## Inhalt

- Einleitung
- Architektur
- Frontend
- Backend
- API

---

## Einleitung

- Was ist TravelFeed?
- Ziele der Seite
- Gruppenaufteilung

---

## Architektur

- App @fa[arrows-h] API
- TypeScript
- App: Angular v6
- API: ExpressJS mit Erweiterungen
- MySql Datenbank

---

## Frontend

- Atomic Design
- Responsive Design

![Atomic Design](http://ubie.io/wp-content/uploads/2016/08/atomic-web-design.gif)

---

## Backend

- Pflege der Berichte
- Pflege der Übersetzungen
- Administration von allen Benutzeraccounts
- Aufruf über `http://localhost:4200/auth/signin`

---

## API

- Modul-Struktur
- RESTful Prinzip
- TypeORM Library
- Models repräsentieren die Tabellenstruktur

---

## API - Modules

- article
- auth
- comment
- country
- language
- newsletter
- picture
- translation
- user

---

## API - Request @fa[arrow-right] Response

- Request `/api/language`

```
{
    "status": 200,
    "data": [
        {
            "id": "de",
            "name": "Deutsch"
        },
        {
            "id": "en",
            "name": "English"
        }
    ]
}
```

---?color=#000
