import { useState } from "react";
import { SideMenuItem } from "./SideMenuItem";
import type { BoardModel } from "../types/models";

type SideMenuBoardListProps = {
  listIcon: string;
  listTitle: string;
  boardIcon: string;
  boards: BoardModel[];
  expanded?: boolean;
  currentBoard: number;
  setCurrentBoard: (id: number) => void;
};

export function SideMenuBoardList({
  listIcon,
  listTitle,
  boardIcon,
  boards,
  expanded = true,
  currentBoard,
  setCurrentBoard,
}: SideMenuBoardListProps) {
  const [isShowingList, setShowingList] = useState(false);

  return (
    <>
      <SideMenuItem
        icon={isShowingList && expanded ? "angle-down" : listIcon}
        title={listTitle}
        expanded={expanded}
        click={() => setShowingList(!isShowingList)}
      />
      <div className={`flex-1 overflow-y-auto ${expanded && "pl-2"}`}>
        {isShowingList &&
          expanded &&
          boards.map(({ id, name }) => (
            <SideMenuItem
              key={id}
              icon={boardIcon}
              title={name}
              expanded={expanded}
              active={id === currentBoard}
              click={() => setCurrentBoard(id)}
            />
          ))}
      </div>
    </>
  );
}
