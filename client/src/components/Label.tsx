import type { LabelModel } from "../types/models";

export type LabelProps = LabelModel & {
  remove: (id: number) => void;
};

export function Label({ id, name, color, remove }: LabelProps) {
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
