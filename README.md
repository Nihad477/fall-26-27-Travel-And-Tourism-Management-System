# TRAVESTRO - Tourism & Tourist Management System

CSC 3215 Web Technologies - Project Prototype 1 (Fall 2026-27)

TRAVESTRO is a frontend prototype that connects **travellers**, **tour guides**, **hotel and transport service providers** and an **admin**. It uses only HTML, CSS and JavaScript, with no frameworks, libraries, APIs or database.

## How to run

1. Download or clone this repository.
2. Open `index.html` in Chrome or Firefox, or use the **Live Server** extension in VS Code.
3. Click **Sign in** and use one of the demo accounts below.

> All data lives in JavaScript arrays inside `scripts/records.js`. Anything you add, edit or delete stays only while the page is open; reloading a page brings back the sample data.

## Demo accounts

| Role | Username | Password | Result |
|---|---|---|---|
| Admin | `admin` | `travestro1` | Opens the admin dashboard |
| Traveller | `traveler` | `traveler1` | Opens the traveller dashboard |
| Tour Guide | `guide` | `guide1234` | Opens the guide dashboard |
| Service Provider | `provider` | `provider1` | Opens the service provider dashboard |
| Tour Guide (pending) | `mehedi_guide` | `guide1234` | Refused: waiting for approval |
| Service Provider (pending) | `whiteorchid` | `provider1` | Refused: waiting for approval |

You can also sign in with an email, for example `aqil@mail.com`.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Public home page. Anyone can search tours by name, city or guide, filter by type, and set a budget. |
| `signin.html` | One sign-in form for all users. A `switch` on the role opens the right dashboard. |
| `signup.html` | Sign-up for Traveller, Tour Guide or Service Provider (admins cannot sign up). Choosing a role shows that role's fields. Includes a password strength bar. Guides and service providers start as **Pending**. |
| `admin.html` | Admin dashboard |
| `traveler.html` | Traveller dashboard |
| `guide.html` | Tour guide dashboard |
| `provider.html` | Hotel and transport service provider dashboard |

Each dashboard has a left sidebar menu that shows one panel at a time.

## Users and features

Every user can **Create, Read, Update, Delete and Search** their own records, and has **3 unique features** that no other user has.

| User | CRUD + Search | Unique feature 1 | Unique feature 2 | Unique feature 3 |
|---|---|---|---|---|
| **Admin** | Accounts of every role | **Approval Desk**: approve or reject pending guides and service providers; a reason is required to reject; decision history | **Support Tickets**: change ticket status, filter by status and priority, live counters | **Promo Codes**: create codes with dates; shows Upcoming, Active or Expired; "try a code" price checker |
| **Traveller** | Tour requests (only *Requested* trips can be edited or deleted) | **Wishlist Board**: Dream, Planned and Visited columns; move places with arrows | **Expense Splitter**: travel group and shared expenses; shows who owes whom | **Currency Converter**: converts between 8 currencies through taka; swap button |
| **Tour Guide** | Tours (shown as cards) | **Itinerary Builder**: day-by-day stops, sorted by day and time; warns about days with no plan | **Review Inbox**: average rating, filter by stars or by "needs reply", reply to reviews | **Earnings**: 80% share of confirmed and completed trips; filter by month and status |
| **Service Provider** | Rooms | **Booking Requests**: accept or decline; checks that the room is open, big enough and free; blocks the nights | **Room Calendar**: 7-night grid; click to block or free a night; previous and next week | **Bus Seat Map**: 20-seat bus drawn with a loop; pick seats, sell tickets, cancel a sold seat |

## Folder structure

```
.
├── index.html         Home + public tour search
├── signin.html        Sign in (all users)
├── signup.html        Create account (traveller / guide / service provider)
├── admin.html
├── traveler.html
├── guide.html
├── provider.html
├── images/            Postcard and side-panel photos (sign-up photo changes with the chosen role)
├── styles/
│   └── style.css      The only stylesheet
├── scripts/
│   ├── records.js     Sample data (arrays of objects)
│   ├── helpers.js     Shared functions (validation, dates, toast, sidebar)
│   ├── home.js  signin.js  signup.js
│   └── admin.js  traveler.js  guide.js  provider.js
└── project-evaluation/   CO3 forms
```

Every page loads `records.js`, then `helpers.js`, then its own script, at the end of `<body>`.

## Techniques used

Everything follows the techniques used in the course demo project (Weeks 1–6).

- **HTML pages and forms:** semantic tags (`header`, `nav`, `main`, `section`, `aside`, `footer`, `article`); `fieldset` and `legend`; `label for`; input types text, email, password, tel, number, date, time, radio and checkbox; `select`; `textarea`.
- **CSS:** one external stylesheet (`styles/style.css`); element, class and id selectors; box model; Grid and Flexbox; `border-radius`, `box-shadow`, `transition`, `transform`; `:hover` and `:focus`; media queries for phones.
- **Code structure:** HTML, CSS and JS in separate files; one script per page plus the shared `records.js` (data) and `helpers.js` (common functions). Scripts load at the end of `<body>`.
- **JavaScript basics:** `let` / `const`, functions with `return`, `if / else`, `switch` (sign-in redirect, role names, ticket counts), `for` loops, arrays of objects with `push`, `slice` + `concat` (to delete), `indexOf` and `join`.
- **Events:** forms use `onsubmit` with `return false` (set in the page's script); `addEventListener("click" / "keyup" / "change", namedFunction)`; `onclick` on buttons created in tables.
- **JavaScript validation:** done with simple loops and `indexOf`, no regular expressions. Checks include required fields, email shape, BD mobile `01XXXXXXXXX`, guide licence `TG-12345`, trade licence `TRD-123456`, number ranges, dates (end after start, no past dates, minimum age), matching passwords and duplicates. Errors show in red under each field and the border turns red (`element.style`).
- **DOM manipulation:** `getElementById`, `getElementsByName`, `getElementsByClassName`; `.value`, `.checked`, `.innerHTML`, `.className`, `.style`; `createElement` + `appendChild` (approval and itinerary drop-downs); tables and cards redrawn with a `for` loop and `innerHTML`; live search on `keyup`.
- **Small extras:** `Date` for today and day counts, `Math.round` / `Math.floor`, `toFixed` for money, `setTimeout` to hide the pop-up message, `confirm()` before deleting.

## Team

| Member | GitHub username | Part |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
