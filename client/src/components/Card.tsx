import { motion, useDragControls } from "motion/react";
import { StretchableText } from "./StretchableText";
import { tintColor } from "../utilities/tintColor";
import { Label, type LabelData } from "./Label";
import ChatBubbleTextSquareRemixIcon from "@iconify-react/streamline-flex/chat-bubble-text-square-remix";
import { useRef, useState } from "react";

export type CardData = {
  color: string;
  title: string;
  description?: string;
  deadline?: string;
  labels?: LabelData[];
  comments?: string[];
};

export function Card({
  color,
  title,
  description,
  deadline,
  labels,
  comments,
}: CardData) {
  const [areCommentsOpen, setCommentsOpen] = useState(false);
  const [isBigTextMode, setBigTextMode] = useState(false);
  const dragControls = useDragControls();
  const headerRef = useRef<HTMLHeadingElement>(null);

  const handleMouseDown = () => {
    setBigTextMode(true);
  };

  const handleDrag = (event: React.PointerEvent) => {
    dragControls.start(event, { snapToCursor: false });
  };

  const handleEditTitle = () => {
    alert("zaraza edit");
  };

  const handleEditDescription = () => {
    alert("hejka descr");
  };

  const handleEditDeadline = () => {
    alert("bruh dead");
  };

  const handleMouseUp = () => {
    setBigTextMode(false);
  };

  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragTransition={{ power: 0.3 }}
      dragListener={false}
      dragControls={dragControls}
      initial={{ boxShadow: `1px 1px 0 ${tintColor(color, -0.2)}` }}
      animate={{ boxShadow: `3px 3px 0 ${tintColor(color, -0.2)}` }}
      whileDrag={{
        boxShadow: `1px 1px 0 ${tintColor(color, -0.2)}`,
        zIndex: 9999,
      }}
      onDrag={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: color,
        borderRadius: 10,
        position: "relative",
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
          color={tintColor(color, isBigTextMode ? -0.5 : -0.05)}
          fontFamily="Dugas Pro Black"
          fontWeight={100}
        />
      </div>

      <motion.div
        // initial={{ opacity: 0 }}
        animate={{
          opacity: isBigTextMode ? 0 : 1,
          height: isBigTextMode
            ? Math.max(100, headerRef.current?.offsetHeight ?? 0)
            : "auto",
        }}
        transition={{ duration: 0.2 /*delay: 1*/ }}
        style={{
          width: "100%",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 7.5,
          paddingInline: 15,
        }}
      >
        <div
          style={{
            paddingTop: 15,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            ref={headerRef}
            onDoubleClick={handleEditTitle}
            onPointerDown={handleDrag}
            style={{ color: tintColor(color, -0.7), userSelect: "none" }}
          >
            {title}
          </h3>
          {description && (
            <p onDoubleClick={handleEditDescription}>{description}</p>
          )}
        </div>

        {deadline && labels && (
          <div
            style={{
              display: "flex",
              gap: 7.5,
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {labels.map((data, index) => (
              <Label key={index} name={data.name} color={data.color} />
            ))}
          </div>
        )}

        <div
          style={{
            paddingBottom: 15,
            display: "flex",
            gap: 5,
            justifyContent: "end",
            alignItems: "end",
          }}
        >
          {!deadline && labels && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7.5,
                flex: 1,
              }}
            >
              {labels.map((data, index) => (
                <Label key={index} name={data.name} color={data.color} />
              ))}
            </div>
          )}

          {deadline && (
            <p
              onDoubleClick={handleEditDeadline}
              style={{ flex: 1, fontStyle: "italic" }}
            >
              {deadline}
            </p>
          )}

          <motion.a
            onClick={() => setCommentsOpen(!areCommentsOpen)}
            style={{
              color: tintColor(color, -0.7),
              display: "flex",
              alignItems: "center",
            }}
            whileHover={{ color: tintColor(color, -0.4), scale: 1.1 }}
          >
            <ChatBubbleTextSquareRemixIcon height="1em" />
          </motion.a>
        </div>
      </motion.div>
      <motion.div
        style={{
          backgroundColor: tintColor(color, -0.04),
          borderRadius: "0 0 3px 3px",
          width: 244,
          // paddingInline: 5,
          // paddingBottom: 5,
          display: "flex",
          flexDirection: "column",
          gap: 7.5,
          fontSize: "0.95em",
        }}
      >
        {areCommentsOpen && (
          <motion.input
            placeholder="Write a comment..."
            style={
              {
                backgroundColor: tintColor(color, -0.08),
                border: "none",
                borderRadius: "0 0 2px 2px",
                padding: 5,
                color: tintColor(color, 0.8),
                "--placeholder-color": tintColor(color, 0.3),
              } as React.CSSProperties
            }
          />
        )}
      </motion.div>
    </motion.div>
  );
}
