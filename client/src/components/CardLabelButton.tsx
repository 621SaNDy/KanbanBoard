import type { LabelModel } from "../types/models";

type LabelProps = LabelModel & {
  click: (id: number) => void;
};

export function CardLabelButton({ id, name, color, click }: LabelProps) {
  return (
    <div
      className="border-3 border-fg border-solid inset-shadow-border-small flex pl-1"
      style={{ backgroundColor: color + "88" }}
    >
      <p>{name}</p>
      <button onClick={() => click(id)}>+</button>
    </div>
  );
}
