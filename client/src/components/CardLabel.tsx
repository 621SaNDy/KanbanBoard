import type { LabelModel } from "../types/models";
import { HoverableIcon } from "./HoverableIcon";

type CardLabelProps = LabelModel & {
  remove: (id: number) => void;
};

export function CardLabel({ id, name, color, remove }: CardLabelProps) {
  return (
    <div
      className="border-3 border-fg border-solid inset-shadow-border-small flex items-center pl-1 pr-1"
      style={{ backgroundColor: color + "88" }}
    >
      <p className="label-text flex-1 min-w-0">{name}</p>
      <a className="flex items-center text-[0.8em]" onClick={() => remove(id)}>
        <HoverableIcon name="trash-alt" />
      </a>
    </div>
  );
}
