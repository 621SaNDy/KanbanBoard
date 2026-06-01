import { useState } from "react";

type HoverableIconProps = {
  name: string;
  useHover?: boolean;
  alwaysHover?: boolean;
};

export function HoverableIcon({
  name,
  useHover = true,
  alwaysHover = false,
}: HoverableIconProps) {
  const [isHovered, setHovered] = useState(false);

  return (
    <i
      className={`hn hn-${name}${(isHovered && useHover) || alwaysHover ? ` hn-${name}-solid` : ""}`}
      onMouseEnter={useHover ? () => setHovered(true) : undefined}
      onMouseLeave={useHover ? () => setHovered(false) : undefined}
      onFocus={useHover ? () => setHovered(true) : undefined}
      onBlur={useHover ? () => setHovered(false) : undefined}
    />
  );
}
