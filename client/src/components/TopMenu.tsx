import { useEffect, useRef, useState } from "react";
import type { BoardModel } from "../types/models";
import { TopMenuItem } from "./TopMenuItem";
import { TopMenuSearchBar } from "./TopMenuSearchBar";

type TopMenuProps = {
  board: BoardModel;
  editBoardName: (id: number, name: string) => void;
  removeBoard: (id: number) => void;
};

export function TopMenu({ board, editBoardName, removeBoard }: TopMenuProps) {
  const [isEditingBoardName, setEditingBoardName] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const boardNameInputRef = useRef<HTMLInputElement>(null);

  const handleBoardNameTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingBoardName(false);
      if ((e.target as HTMLTextAreaElement).value.trim() !== "") {
        editBoardName(board.id, newBoardName);
      }
    }
    if (e.key === "Escape") {
      setEditingBoardName(false);
    }
  };

  useEffect(() => {
    if (isEditingBoardName && boardNameInputRef.current) {
      boardNameInputRef.current.value = board.name;
      boardNameInputRef.current.focus();
      boardNameInputRef.current.select();
      setNewBoardName(board.name);
    }
  }, [isEditingBoardName]);

  return (
    <div className="shadow-border-rounded inset-shadow-border m-border flex items-center pl-4 pr-4 min-h-12">
      {isEditingBoardName ? (
        <input
          className="h1-input flex-1"
          ref={boardNameInputRef}
          placeholder={board.name}
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value.replaceAll("\n", ""))}
          onKeyDown={handleBoardNameTextAreaKeyDown}
          onBlur={() => setEditingBoardName(false)}
        />
      ) : (
        <h1
          className="flex-1 overflow-hidden w-0 whitespace-nowrap text-ellipsis"
          onDoubleClick={() => setEditingBoardName(true)}
        >
          {board.name}
        </h1>
      )}

      <div className="flex justify-end gap-2 pr-4">
        <TopMenuItem icon="exclamation-triangle" click={() => {}} />
        <TopMenuItem icon="tag" click={() => {}} />
        <TopMenuItem icon="filter" click={() => {}} />
        <TopMenuItem icon="trash-alt" click={() => removeBoard(board.id)} />
      </div>
      <TopMenuSearchBar />
    </div>
  );
}
