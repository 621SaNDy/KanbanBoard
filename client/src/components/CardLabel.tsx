import type { LabelModel } from "../types/models";

type CardLabelProps = LabelModel;

export function CardLabel({ id, name, color }: CardLabelProps) {
  return (
    <div
      className="border-3 border-fg border-solid inset-shadow-border-small flex items-center pl-1 pr-1"
      style={{ backgroundColor: color + "66" }}
    >
      <p className="label-text text-fg-label flex-1 min-w-0">{name}</p>
    </div>
  );
}
