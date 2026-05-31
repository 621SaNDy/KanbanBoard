import { useState } from "react";
import type { BoardModel } from "../types/models";
import { TopMenuItem } from "./TopMenuItem";
import { TopMenuSearchBar } from "./TopMenuSearchBar";

type TopMenuProps = {
  board: BoardModel;
  editBoardName: (id: number, name: string) => void;
  removeBoard: (id: number) => void;
};

export function TopMenu({ board, editBoardName, removeBoard }: TopMenuProps) {
  const [newBoardName, setNewBoardName] = useState("");

  return (
    <div className="shadow-border-rounded inset-shadow-border m-border flex items-center pl-4 pr-4">
      <h1>{board.name}</h1>
      <input
        placeholder="new bord name"
        value={newBoardName}
        onChange={(e) => setNewBoardName(e.target.value)}
      />
      <button onClick={() => editBoardName(board.id, newBoardName)}>go!</button>

      <div className="flex-1 flex justify-end gap-2 pr-4">
        <TopMenuItem icon="exclamation-triangle" click={() => {}} />
        <TopMenuItem icon="tag" click={() => {}} />
        <TopMenuItem icon="filter" click={() => {}} />
        <TopMenuItem icon="trash-alt" click={() => removeBoard(board.id)} />
      </div>
      <TopMenuSearchBar />
    </div>
  );
}
