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

@ul[squares]

- Was ist TravelFeed?
- Ziele der Seite
- Gruppenaufteilung

@ulend

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

@ul[squares]

- Atomic Design
- Responsive Design

@ulend

![Atomic Design](http://ubie.io/wp-content/uploads/2016/08/atomic-web-design.gif)


---

## Backend

@ul[squares]

- Pflege der Berichte
- Pflege der Übersetzungen
- Administration von allen Benutzeraccounts
- Aufruf über `http://localhost:4200/auth/signin`

@ulend

---

## API

@ul[squares]

- Modul-Struktur
- Models repräsentieren die Tabellenstruktur

@ulend

---

## API - Modules

@ul[squares]

- article
- auth
- comment
- country
- language
- newsletter
- picture
- translation
- user

@ulend

---

## API - Request @fa[arrow-right] Response

@ul[squares]

- Request `/api/language`

@ulend

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

---?color#000
