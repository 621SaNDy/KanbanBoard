import { motion } from "motion/react";
import { StretchableText } from "./StretchableText";
import { tintColor } from "../utilities/tintColor";
import { Label, type LabelData } from "./Label";
import ChatBubbleTextSquareRemixIcon from "@iconify-react/streamline-flex/chat-bubble-text-square-remix";
import { useEffect, useRef, useState } from "react";

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
  const [isMouseMoving, setMouseMoving] = useState(false);
  const [mouseMoveStart, setMouseMoveStart] = useState<[number, number] | null>(null);
  const [baseHeight, setBaseHeight] = useState(0);
  const [height, setHeight] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseMoving(true);
    setMouseMoveStart([e.clientX, e.clientY]);
    setBaseHeight(boxRef.current!.offsetHeight); 
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseMoving) {
      // console.log(e.clientX, e.clientY);
      if (height != null && mouseMoveStart != null) {
        setHeight(baseHeight + (e.clientY - mouseMoveStart[1]));
        console.log((baseHeight + (e.clientY - mouseMoveStart[1])).toString());
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    setMouseMoving(false);
    setMouseMoveStart(null);
    setHeight(boxRef.current!.offsetHeight);
  }

  useEffect(() => {
    setBaseHeight(boxRef.current!.offsetHeight)
    setHeight(boxRef.current!.offsetHeight)
  }, [])

  return (
    <motion.div
      // drag
      // dragElastic={0.2}
      // dragTransition={{ power: 0.3 }}
      // initial={{ boxShadow: `1px 1px 0 ${tintColor(color, -0.2)}` }}
      // animate={{ boxShadow: `3px 3px 0 ${tintColor(color, -0.2)}` }}
      // whileDrag={{
      //   boxShadow: `1px 1px 0 ${tintColor(color, -0.2)}`,
      // }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: color,
        borderRadius: 10,
        position: "relative",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={boxRef}
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
          color={tintColor(color, -0.03)}
          fontFamily="Dugas Pro Black"
          fontWeight={100}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        style={{
          width: "100%",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 7.5,
          paddingInline: 15,
          height: height ?? "auto"
        }}
      >
        <div
          style={{
            paddingTop: 15,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ color: tintColor(color, -0.7) }}>{title}</h3>
          {description && <p>{description}</p>}
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
            {labels.map((data) => (
              <Label name={data.name} color={data.color} />
            ))}
          </div>
        )}

        <div
          style={{
            paddingBottom: 15,
            display: "flex",
            gap: 5,
            justifyContent: "end",
            alignItems: "end"
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
              {labels.map((data) => (
                <Label name={data.name} color={data.color} />
              ))}
            </div>
          )}

          {deadline && <p style={{ flex: 1, fontStyle: "italic" }}>{deadline}</p>}

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
