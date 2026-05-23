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
  comments?: string[];
};

export function StretchableCard({
  color,
  title,
  description,
  due,
  labels,
  comments,
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
        width: 250,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div
        style={{
          backgroundColor: color,
          borderRadius: 3,
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
            color={tintColor(color, -0.05)}
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
            <motion.a
              onClick={() => {}}
              style={{ color: tintColor(color, -0.8) }}
              whileHover={{ color: tintColor(color, -0.4), scale: 1.1 }}
            >
              <PencilSquareRemixIcon height="1em" />
            </motion.a>
            <motion.a
              onClick={() => {}}
              style={{ color: tintColor(color, -0.8) }}
              whileHover={{ color: tintColor(color, -0.4), scale: 1.1 }}
            >
              <RecycleBinRemixIcon height="1em" />
            </motion.a>
            <motion.a
              onClick={() => {}}
              style={{ color: tintColor(color, -0.8) }}
              whileHover={{ color: tintColor(color, -0.4), scale: 1.1 }}
            >
              <ChatBubbleTextSquareRemixIcon height="1em" />
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        style={{
          backgroundColor: tintColor(color, -0.04),
          width: 240,
          borderInline: `5px solid ${color}`,
          borderBottom: `5px solid ${color}`,
          borderRadius: "0 0 3px 3px",
          padding: 5,
          display: "flex",
          flexDirection: "column",
          gap: 7.5,
          fontSize: "0.95em",
        }}
      >
        {comments && (
          <div
            style={{
              paddingInline: 5,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {comments.map((comment) => (
              <p>{comment}</p>
            ))}
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.05, boxShadow: "0 0 10px #0004" }}
          placeholder="Write a comment..."
          style={
            {
              backgroundColor: tintColor(color, -0.12),
              border: "none",
              borderRadius: 2,
              paddingBlock: 3,
              paddingInline: 5,
              boxShadow: "0 0 10px transparent",
              color: tintColor(color, 0.8),
              "--placeholder-color": tintColor(color, 0.3),
            } as React.CSSProperties
          }
        />
      </motion.div>
    </motion.div>
  );
}
