import type { LabelModel } from "../types/models";
import { HoverableIcon } from "./HoverableIcon";

type LabelProps = LabelModel & {
  icon: string;
  click: (id: number) => void;
};

export function CardLabelButton({ id, name, color, icon, click }: LabelProps) {
  return (
    <div
      className="border-3 border-fg border-solid inset-shadow-border-small flex items-center pl-1 pr-1 gap-1"
      onClick={() => click(id)}
      style={{ backgroundColor: color + "88" }}
    >
      <p className="label-text flex-1 min-w-0">{name}</p>
      <a className="flex items-center text-[0.8em]">
        <HoverableIcon name={icon} />
      </a>
    </div>
  );
}
