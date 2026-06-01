import { useState } from "react";
import { HoverableIcon } from "./HoverableIcon";

type TopMenuItemProps = {
  icon: string;
  click: () => void;
};

export function TopMenuItem({ icon, click }: TopMenuItemProps) {
  const [isHovered, setHovered] = useState(false);

  return (
    <div
      className="flex p-2 text-[1.1em]"
      onClick={click}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <HoverableIcon name={icon} alwaysHover={isHovered} />
    </div>
  );
}
