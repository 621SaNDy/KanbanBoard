# KanbanBoard Client

## Installation
The entire project is supposed to be ran with Docker Compose, but you can launch the client separately by entering the following commands in the current (`/client`) directory:
```bash
npm i
npm run dev
```
The client will be available at the default Vite port, most likely `http://localhost:5173`, and will try to connect to the backend under the address specified in a `VITE_BACKEND_URL` environment variable, or default to `:3000` if it hasn't been set.

## Usage
### Side menu
Opening a fresh site will result in a blank page with a side menu on the left. You can use its topmost button to expand the menu, but it is fully functional in collapsed mode as well.

Use the "+" button to add a new board, and its name will appear in the menu, allowing you to switch between boards.

With the other buttons located in the bottom left you can toggle full screen, override the automatic choice of the light/dark theme and visit the GitHub page of the project.

### Top menu
Once a board is selected, a top menu with its title and board-specific options will appear. The board name is editable by double clicking. Editing is simple - you confirm with Enter and cancel with Esc or by unfocusing the field.

The buttons, going from the left, allow enabling due date warnings, toggle the label manager, filter menu and delete the board. You can also find a search bar there, must I explain what it does? :P

### Board
The board interface contains a "+" button on the left, used for _(you guessed it!)_ adding columns. That's pretty much all I have to say.

### Columns
Each column has a title, a "+" button for adding cards and, well, cards. Renaming goes the same as for boards, by double clicking the header. There's also a little recycle bin button, and I bet you've never seen one like it and have no idea what its function could be...

### Cards
Since every child is obviously better and more innovative than its parents, the same goes for the cards. Here you can double-click-edit as much as four different properties - the title, description, due date and labels.

To get rid of the description or due date, press Delete or confirm with the field empty. To remove all labels... well, remove all labels.

If any of these are not present, they can be added with their respective buttons in the bottom right corner. For the description, there's a "paragraph" symbol, the due date has a clock, the labels are under a hashtag, and for the title the app breaks, as it's not supposed to be null.

The "message bubble" button shows and hides the comment section, where you can write and delete additional messages about the cards. The ever-present recycle bin icon is next to it.

When the overdue warning mode is enabled, the cards' backgrounds tint orange when due in less than 3 days, and red if their deadline has already passed.

Additionally, cards can be grabbed by the title and dragged inside or across columns in order to re... order them.

### Labels
The labels are added in a dedicated menu mentioned in the "Top menu" section by entering their name, selecting a color and clicking the "+" button. Below is a list where you can delete the unwanted ones.

They are used mainly for categorization of the cards, and you can filter the board to show only cards of specific categories using the next side menu, named _(that's a hard one!)_... the filter menu! The filtering is active only with the menu open, and no columns or cards can be created or dragged in this mode.

Labels are board-specific and must be first created in the label menu in order to be assignable to cards.