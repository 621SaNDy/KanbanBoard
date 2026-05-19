# Dokumentacja

**Ogólne:**
- Base URL: `http://<HOST>:<PORT>`
- Content-Type: `application/json`

---

**Boards**

- GET /boards
  - Opis: Pobiera listę tablic.
  - Response 200: Array of boards
  - Example:
    ```json
    [ {"id":1,"name":"Projekt A"} ]
    ```

- POST /boards
  - Body: { "name": string }
  - Response 201: created board
  - Example body:
    ```json
    { "name": "Nowa tablica" }
    ```
  - Example response:
    ```json
    {"id":2,"name":"Nowa tablica"}
    ```

- GET /boards/:boardId
  - Opis: Pobiera tablicę wraz z kolumnami i kartami (kolumny.posortowane wg `position`, karty wg `position`).
  - Path params: `boardId` (number)
  - Response 200: board object with `columns` array (each column zawiera `cards`)

- PATCH /boards/:boardId
  - Body: { "name": string }
  - Response 200: zaktualizowany board

- DELETE /boards/:boardId
  - Response 200: { message: 'Board deleted successfully' }

Errors common: 404 dla nieistniejącego `boardId`, 500 dla błędów serwera.

---

**Columns**

- GET /boards/:boardId/columns
  - Opis: Pobiera kolumny danej tablicy, posortowane wg `position`.
  - Response 200: array of columns

- POST /boards/:boardId/columns
  - Body: { "name": string }
  - Tworzy kolumnę na końcu (automatycznie ustawia `position`).
  - Response 201: created column

- PATCH /columns/:columnId
  - Body: { "name"?: string, "position"?: number }
  - Partial update; zwraca zaktualizowaną kolumnę.

- DELETE /columns/:columnId
  - Response 200: { message: 'Column deleted successfully' }

- PATCH /boards/:boardId/columns/reorder
  - Body: { "order": [int, int, ...] } — tablica `id` kolumn w docelowej kolejności.
  - Response 200: zaktualizowana lista kolumn (posortowana według nowej pozycji).
  - Example body:
    ```json
    { "order": [12, 9, 5] }
    ```

---

**Cards**

- GET /columns/:columnId/cards
  - Opis: Pobiera karty danej kolumny ordered by `position`.
  - Response 200: array of cards

- POST /columns/:columnId/cards
  - Body: { "title": string, "description"?: string, "dueDate"?: string }
  - Tworzy kartę na końcu kolumny (automatyczne `position`).
  - Response 201: created card
  - Example body:
    ```json
    { "title": "Zadanie", "description": "Opis", "dueDate": "2026-06-01" }
    ```

- GET /cards/:cardId
  - Response 200: card object

- PATCH /cards/:cardId
  - Body: { "title"?: string, "description"?: string, "dueDate"?: string, "position"?: number }
  - Partial update; zmienia pola karty (można bezpośrednio ustawić `position`).
  - Response 200: updated card

- DELETE /cards/:cardId
  - Response 200: { message: 'Card deleted successfully' }

- PATCH /cards/:cardId/move
  - Opis: Przenosi kartę w tej samej lub innej kolumnie i rekonstruuje pozycje.
  - Body: { "columnId": number, "position": number }
    - `columnId`: docelowa kolumna
    - `position`: docelowa pozycja (1-based). Jeśli brak lub nieprawidłowa — traktowana jako 1 lub dopasowana do zakresu.
  - Response 200: zaktualizowana karta
  - Uwagi: Backend używa transakcji i rekonstruuje `position` dla kolumn źródłowej i docelowej.

---

**Comments**

- GET /cards/:cardId/comments
  - Response 200: array of comments (ordered by id ASC)

- POST /cards/:cardId/comments
  - Body: { "content": string }
  - Response 201: created comment

- PATCH /cards/:cardId/comments/:commentId
  - Body: { "content"?: string }
  - Response 200: updated comment

- DELETE /cards/:cardId/comments/:commentId
  - Response 200: { message: 'Comment deleted successfully' }

---

**Labels**

- GET /boards/:boardId/labels
  - Response 200: array of labels for board

- POST /boards/:boardId/labels
  - Body: { "name": string, "color": string }
  - Response 201: created label

- PATCH /boards/:boardId/labels/:labelId
  - Body: { "name"?: string, "color"?: string }
  - Response 200: updated label

- DELETE /boards/:boardId/labels/:labelId
  - Response 200: { message: 'Label deleted successfully' }

---

**Błędy i kody statusu**
- 200 — ok
- 201 — utworzono zasób
- 404 — zasób nie znaleziony (np. `Board not found`, `Card not found`, `Comment not found`)
- 500 — Internal Server Error
