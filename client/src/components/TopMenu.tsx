import { useEffect, useRef, useState } from "react";
import type { BoardModel } from "../types/models";
import { TopMenuItem } from "./TopMenuItem";

type TopMenuProps = {
  board: BoardModel;
  editBoardName: (id: number, name: string) => void;
  removeBoard: (id: number) => void;
  isLabelMenuOpen?: boolean;
  toggleLabelMenu?: () => void;
  isFilterMenuOpen?: boolean;
  toggleFilterMenu?: () => void;
  isWarningEnabled?: boolean;
  toggleWarning?: () => void;
  searchedText: string;
  setSearchedText: (text: string) => void;
  isAutoEditEnabled?: boolean;
  setAutoEditUsed?: () => void;
};

export function TopMenu({
  board,
  editBoardName,
  removeBoard,
  isLabelMenuOpen,
  toggleLabelMenu,
  isFilterMenuOpen,
  toggleFilterMenu,
  isWarningEnabled,
  toggleWarning,
  searchedText,
  setSearchedText,
  isAutoEditEnabled,
  setAutoEditUsed,
}: TopMenuProps) {
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

  useEffect(() => {
    if (isAutoEditEnabled) {
      setEditingBoardName(true);
      setAutoEditUsed?.();
    }
  }, [isAutoEditEnabled, setAutoEditUsed]);

  return (
    <div className="shadow-border-rounded inset-shadow-border m-border bg-bg-dark flex items-center pr-2 min-h-12">
      {isEditingBoardName ? (
        <input
          className="pl-3 h1-input flex-1"
          ref={boardNameInputRef}
          placeholder={board.name}
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value.replaceAll("\n", ""))}
          onKeyDown={handleBoardNameTextAreaKeyDown}
          onBlur={() => setEditingBoardName(false)}
        />
      ) : (
        <h1
          className="pl-3 pr-1 flex-1 overflow-hidden w-0 whitespace-nowrap text-ellipsis"
          onDoubleClick={() => setEditingBoardName(true)}
        >
          {board.name}
        </h1>
      )}

      <div className="flex justify-end gap-1 pl-3 pr-3">
        <TopMenuItem
          icon="exclamation-triangle"
          active={isWarningEnabled}
          click={() => toggleWarning?.()}
        />
        <TopMenuItem
          icon="hashtag"
          active={isLabelMenuOpen}
          click={() => toggleLabelMenu?.()}
        />
        <TopMenuItem
          icon="filter"
          active={isFilterMenuOpen}
          click={() => toggleFilterMenu?.()}
        />
        <TopMenuItem icon="trash-alt" click={() => removeBoard(board.id)} />
      </div>
      <input
        className="border-3 border-fg border-solid"
        type="text"
        placeholder="Search..."
        value={searchedText}
        onChange={(e) => setSearchedText(e.target.value)}
      />
    </div>
  );
}
