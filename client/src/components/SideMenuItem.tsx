import { useState } from "react";
import { HoverableIcon } from "./HoverableIcon";

type SideMenuItemProps = {
  icon: string;
  title: string;
  expanded?: boolean;
  active?: boolean;
  click: () => void;
};

export function SideMenuItem({
  icon,
  title,
  expanded = true,
  active = false,
  click,
}: SideMenuItemProps) {
  const [isHovered, setHovered] = useState(false);

  return (
    <div
      className={`flex items-center pl-4 pr-4 pt-2 pb-2 ${
        active || (isHovered && expanded) ? "bg-fg" : ""
      } ${active || (isHovered && expanded) ? "text-bg" : ""}`}
      onClick={click}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <HoverableIcon
        name={icon}
        useHover={false}
        alwaysHover={!expanded && isHovered}
      />
      <p
        className={`text-nowrap overflow-hidden text-ellipsis ${expanded ? "pl-3" : "w-0"}`}
      >
        {title}
      </p>
    </div>
  );
}
