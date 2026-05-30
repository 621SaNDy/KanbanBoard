import type { LabelModel } from "../types/models";

type CardLabelProps = LabelModel & {
  remove: (id: number) => void;
};

export function CardLabel({ id, name, color, remove }: CardLabelProps) {
  return (
    <div
      className="border-3 border-fg border-solid inset-shadow-border-small flex pl-1"
      style={{ backgroundColor: color + "88" }}
    >
      <p>{name}</p>
      <button onClick={() => remove(id)}>X</button>
    </div>
  );
}
