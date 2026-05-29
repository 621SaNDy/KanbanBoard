import { motion } from "motion/react";
import { tintColor } from "../utilities/tintColor";
import type { LabelModel } from "../types/models";

export type LabelProps = LabelModel & {
  click: (id: number) => void;
};

export function LabelButton({ id, name, color, click }: LabelProps) {
  return (
    <motion.div
      onClick={() => click(id)}
      style={{
        backgroundColor: color + "bb",
        paddingInline: 3,
        paddingBlock: 1,
        borderRadius: 2,
      }}
    >
      <p
        style={{
          color: tintColor(color, 0.75),
          fontSize: "0.9em",
        }}
      >
        + {name}
      </p>
    </motion.div>
  );
}
