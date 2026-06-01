import { SideMenuItem } from "./SideMenuItem";
import type { BoardModel } from "../types/models";

type SideMenuBoardListProps = {
  boardIcon: string;
  boards: BoardModel[];
  expanded?: boolean;
  currentBoard: number;
  setCurrentBoard: (id: number) => void;
};

export function SideMenuBoardList({
  boardIcon,
  boards,
  expanded = true,
  currentBoard,
  setCurrentBoard,
}: SideMenuBoardListProps) {
  return (
    <div className={`flex-1 overflow-y-auto`}>
      {boards.map(({ id, name }) => (
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
  );
}
