import { useState } from "react";
import { SideMenuItem } from "./SideMenuItem";
import type { BoardModel } from "../types/models";
import { useDarkMode } from "../hooks/useDarkMode";
import { SideMenuBoardList } from "./SideMenuBoardList";

type SideMenuProps = {
  boards: BoardModel[];
  currentBoard: number;
  addBoard: () => void;
  setCurrentBoard: (id: number) => void;
};

export function SideMenu({ boards, currentBoard, addBoard, setCurrentBoard }: SideMenuProps) {
  const [isExpanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useDarkMode();

  return (
    <div
      onPointerEnter={() => setExpanded(true)}
      onPointerLeave={() => setExpanded(false)}
      className="shadow-border-rounded inset-shadow-border mt-border mr-border mb-border flex flex-col pt-2 pb-2"
    >
      <SideMenuItem expanded={isExpanded} icon="plus" title="New board" click={addBoard} />
      <SideMenuBoardList
        expanded={isExpanded}
        listIcon="bars"
        boardIcon="notebook"
        listTitle="Board list"
        boards={boards}
        currentBoard={currentBoard}
        setCurrentBoard={setCurrentBoard}
      />
      <SideMenuItem expanded={isExpanded} icon="expand" title="Full screen" click={() => {}} />
      <SideMenuItem expanded={isExpanded} icon={theme === "light" ? "sun" : "moon"} title="Toggle theme" click={toggleTheme} />
      <SideMenuItem expanded={isExpanded} icon="cog" title="Settings" click={() => {}} />
      <SideMenuItem expanded={isExpanded} icon="info-circle" title="About" click={() => {}} />
      <SideMenuItem expanded={isExpanded} icon="github" title="Our GitHub" click={() => {}} />
    </div>
  );
}
