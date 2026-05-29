import { motion } from "motion/react";
import type { LabelModel } from "../types/models";

export type LabelProps = LabelModel & {
  remove: (id: number) => void;
};

export function Label({ id, name, color, remove }: LabelProps) {
  return (
    <motion.div className="flex" style={{ backgroundColor: color }}>
      <p className="flex-1">{name}</p>

      <button onClick={() => remove(id)}>ziuu</button>
    </motion.div>
  );
}
