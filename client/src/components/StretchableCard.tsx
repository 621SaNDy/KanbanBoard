import { motion } from "motion/react";
import { StretchableText } from "./StretchableText";
import { tintColor } from "../utilities/tintColor";

type StretchableCardProps = {
  title: string;
  description: string;
  due: string;
  color: string;
};

export function StretchableCard({
  title,
  description,
  due,
  color,
}: StretchableCardProps) {
  return (
    <motion.div
          drag
          dragElastic={0.2}
          dragTransition={{ power: 0.3 }}
          initial={{ boxShadow: "0 0 10px #00000000" }}
          whileDrag={{
            rotate: "3deg",
            boxShadow: "0 0 20px #00000033",
          }}
          style={{
            backgroundColor: color,
            width: 300,
            height: 250,
            padding: 10,
            position: "relative",
          }}
        >
          <StretchableText
            text={title.split(" ")[0]}
            color={tintColor(color, -0.1)}
            fontFamily="Dugas Pro Black"
            fontWeight={100}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              paddingInline: 20,
              paddingBlock: 15,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <h3>{title}</h3>
            <p>{description}</p>
            <p>Deadline: {due}</p>
          </motion.div>
        </motion.div>
  )
}
