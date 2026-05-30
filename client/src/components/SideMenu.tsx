import { useState } from "react";
import { SideMenuItem } from "./SideMenuItem";
import type { BoardModel } from "../types/models";
import { useDarkMode } from "../hooks/useDarkMode";

type SideMenuProps = {
  boards: BoardModel[];
};

export function SideMenu({ boards }: SideMenuProps) {
  const [isExpanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useDarkMode();

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = () => {
    setExpanded(false);
  };

  return (
    <div
      onPointerEnter={handleExpand}
      onPointerLeave={handleCollapse}
      className="shadow-border-rounded inset-shadow-border mt-border mr-border mb-border flex flex-col pt-2 pb-2"
    >
      <SideMenuItem expanded={isExpanded} icon="plus" title="New board" click={() => {}} />
      {/* {isExpanded ? (
        boards.map(({ id, name }) => (
          <SideMenuItem expanded={isExpanded} key={id} icon="notebook" title={name} click={() => {}} />
        ))
      ) : ( */}
        <SideMenuItem expanded={isExpanded} icon="bars" title="Board list" click={() => {}} />
      {/* )} */}
      <SideMenuItem expanded={isExpanded} icon="expand" title="Full screen" click={() => {}} />
      <SideMenuItem expanded={isExpanded} icon={theme === "light" ? "sun" : "moon"} title="Toggle theme" click={toggleTheme} />
      <SideMenuItem expanded={isExpanded} icon="cog" title="Settings" click={() => {}} />
      <SideMenuItem expanded={isExpanded} icon="info-circle" title="About" click={() => {}} />
      <SideMenuItem expanded={isExpanded} icon="github" title="Our GitHub" click={() => {}} />
    </div>
  );
}
