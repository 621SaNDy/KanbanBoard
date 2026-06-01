import type { LabelModel } from "../types/models";
import { HoverableIcon } from "./HoverableIcon";

type LabelProps = LabelModel & {
  icon: string;
  iconOnlyButton?: boolean;
  click: (id: number) => void;
};

export function CardLabelButton({
  id,
  name,
  color,
  icon,
  iconOnlyButton = false,
  click,
}: LabelProps) {
  return (
    <div
      className="border-3 border-fg border-solid inset-shadow-border-small flex items-center pl-1 pr-1 gap-1"
      onClick={() => (iconOnlyButton ? {} : click(id))}
      style={{ backgroundColor: color + "66" }}
    >
      <p className="label-text flex-1 min-w-0">{name}</p>
      <a
        className="flex items-center text-[0.8em]"
        onClick={() => (iconOnlyButton ? click(id) : {})}
      >
        <HoverableIcon name={icon} useHover={iconOnlyButton} />
      </a>
    </div>
  );
}
