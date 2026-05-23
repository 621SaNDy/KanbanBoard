import { motion } from "motion/react";
import { tintColor } from "../utilities/tintColor";

export type LabelData = {
  name: string;
  color: string;
};

export function Label({ name, color }: LabelData) {
  return (
    <motion.div
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
        {name}
      </p>
    </motion.div>
  );
}
