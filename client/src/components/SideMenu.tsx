import { useState } from "react";
import { SideMenuItem } from "./SideMenuItem";
import type { BoardModel } from "../types/models";
import { useDarkMode } from "../hooks/useDarkMode";
import { SideMenuBoardList } from "./SideMenuBoardList";
import { useFullScreen } from "../hooks/useFullScreen";

type SideMenuProps = {
  boards: BoardModel[];
  currentBoard: number;
  addBoard: () => void;
  setCurrentBoard: (id: number) => void;
};

export function SideMenu({
  boards,
  currentBoard,
  addBoard,
  setCurrentBoard,
}: SideMenuProps) {
  const [isExpanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useDarkMode();
  const { isFullscreen, toggleFullScreen } = useFullScreen();

  const handleGitHubLink = () => {
    window.open("https://github.com/621SaNDy/KanbanBoard", "_blank")?.focus();
  };

  return (
    <div
      className={`shadow-border-rounded inset-shadow-border m-border bg-bg-dark flex flex-col pt-2 pb-2 max-w-[15vw] ${
        isExpanded ? "min-w-40" : null
      }`}
    >
      <SideMenuItem
        expanded={isExpanded}
        icon={isExpanded ? "angle-left" : "bars"}
        title="Collapse menu"
        click={() => setExpanded(!isExpanded)}
      />
      <SideMenuItem
        expanded={isExpanded}
        icon="plus"
        title="New board"
        click={addBoard}
      />
      <SideMenuBoardList
        expanded={isExpanded}
        boardIcon="table"
        boards={boards}
        currentBoard={currentBoard}
        setCurrentBoard={setCurrentBoard}
      />
      <SideMenuItem
        expanded={isExpanded}
        icon={isFullscreen ? "collapse" : "expand"}
        title={`${isFullscreen ? "Exit full" : "Full"} screen`}
        click={toggleFullScreen}
      />
      <SideMenuItem
        expanded={isExpanded}
        icon={theme === "light" ? "sun" : "moon"}
        title="Toggle theme"
        click={toggleTheme}
      />
      <SideMenuItem
        expanded={isExpanded}
        icon="cog"
        title="Settings"
        click={() => {}}
      />
      <SideMenuItem
        expanded={isExpanded}
        icon="info-circle"
        title="About"
        click={() => {}}
      />
      <SideMenuItem
        expanded={isExpanded}
        icon="github"
        title="Our GitHub"
        click={handleGitHubLink}
      />
    </div>
  );
}
