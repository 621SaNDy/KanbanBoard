import { motion } from "motion/react";
import { StretchableText } from "./StretchableText";
import { tintColor } from "../utilities/tintColor";
import { Label, type LabelData } from "./Label";
import PencilSquareRemixIcon from "@iconify-react/streamline-flex/pencil-square-remix";
import RecycleBinRemixIcon from "@iconify-react/streamline-flex/recycle-bin-remix";
import ChatBubbleTextSquareRemixIcon from "@iconify-react/streamline-flex/chat-bubble-text-square-remix";

type StretchableCardProps = {
  color: string;
  title: string;
  description?: string;
  due?: string;
  labels?: LabelData[];
};

export function StretchableCard({
  color,
  title,
  description,
  due,
  labels,
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
        width: 250,
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          padding: 10,
        }}
      >
        <StretchableText
          text={title.split(" ")[0]}
          color={tintColor(color, -0.08)}
          fontFamily="Dugas Pro Black"
          fontWeight={100}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 7.5,
        }}
      >
        <div
          style={{
            paddingInline: 20,
            paddingTop: 15,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ color: tintColor(color, -0.7) }}>{title}</h3>
          {description && <p>{description}</p>}
        </div>

        {labels && (
          <div
            style={{
              paddingInline: 20,
              display: "flex",
              gap: 7.5,
              flexWrap: "wrap",
            }}
          >
            {labels.map((data) => (
              <Label name={data.name} color={data.color} />
            ))}
          </div>
        )}

        <div
          style={{
            paddingInline: 20,
            paddingBottom: 15,
            display: "flex",
            gap: 5,
            justifyContent: "end",
          }}
        >
          {due && <p style={{ flex: 1 }}>{due}</p>}
          <PencilSquareRemixIcon height="1em" />
          <RecycleBinRemixIcon height="1em" />
          <ChatBubbleTextSquareRemixIcon height="1em" />
        </div>
      </motion.div>
    </motion.div>
  );
}
