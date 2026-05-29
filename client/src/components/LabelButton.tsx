import { motion } from "motion/react";
import type { LabelModel } from "../types/models";

export type LabelProps = LabelModel & {
  click: (id: number) => void;
};

export function LabelButton({ id, name, color, click }: LabelProps) {
  return (
    <motion.div onClick={() => click(id)} style={{ backgroundColor: color }}>
      <p>+ {name}</p>
    </motion.div>
  );
}
