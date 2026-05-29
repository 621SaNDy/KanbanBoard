import { motion, useDragControls } from "motion/react";
import { StretchableText } from "./StretchableText";
import { tintColor } from "../utilities/tintColor";
import { Label } from "./Label";
import ChatBubbleTextSquareRemixIcon from "@iconify-react/streamline-flex/chat-bubble-text-square-remix";
import CalendarMarkRemixIcon from "@iconify-react/streamline-flex/calendar-mark-remix";
import RecycleBinRemix from "@iconify-react/streamline-flex/recycle-bin-remix";
import { useEffect, useRef, useState } from "react";
import {
  type CommentModel,
  type CardModel,
  type LabelModel,
  type LabelBindRequest,
} from "../types/models";
import { DateUtility } from "../utilities/DateUtility";
import { ServerConnection } from "../utilities/ServerConnection";
import { LabelButton } from "./LabelButton";
import { Comment } from "./Comment";

type CardProps = CardModel & {
  availableLabels: LabelModel[];
  remove: (id: number) => void;
};

export function Card({
  id,
  title,
  description,
  due_date,
  availableLabels,
  remove,
}: CardProps) {
  const [labels, setLabels] = useState<LabelModel[]>([]);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [areCommentsOpen, setCommentsOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isBigTextMode, setBigTextMode] = useState(false);
  const dragControls = useDragControls();
  const headerRef = useRef<HTMLHeadingElement>(null);
  const color = "#d6cbc1";

  const loadLabels = async () => {
    const newLabels = await ServerConnection.get(`/cards/${id}/labels`);
    setLabels(newLabels);
  };

  const loadComments = async () => {
    const newComments = await ServerConnection.get(`/cards/${id}/comments`);
    setComments(newComments);
  };

  const addLabel = async (labelId: number) => {
    const label: LabelBindRequest = { labelId: labelId };
    await ServerConnection.post(`/cards/${id}/labels`, label);
    loadLabels();
  };

  const removeLabel = async (labelId: number) => {
    await ServerConnection.delete(`/cards/${id}/labels/${labelId}`);
    loadLabels();
  };

  const removeComment = async (commentId: number) => {
    await ServerConnection.delete(`/cards/${id}/comments/${commentId}`);
    loadComments();
  };

  const handleNewComment = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await ServerConnection.post(`/cards/${id}/comments`, {
        content: newCommentContent,
      });
      setNewCommentContent("");
      loadComments();
    }
  };

  const handleShrinkOnDrag = () => {
    setBigTextMode(true);
  };

  const handleStartDrag = (event: React.PointerEvent) => {
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

  const handleExpandOnDragEnd = () => {
    setBigTextMode(false);
  };

  useEffect(() => {
    loadLabels();
    loadComments();
  });

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
      onDrag={handleShrinkOnDrag}
      onDragEnd={handleExpandOnDragEnd}
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
            onPointerDown={handleStartDrag}
            style={{ color: tintColor(color, -0.7), userSelect: "none" }}
          >
            {title}
          </h3>
          {description && (
            <p onDoubleClick={handleEditDescription}>{description}</p>
          )}
        </div>

        <div style={{ display: "flex", gap: 5 }}>
          {availableLabels.map(({ id, name, color }) => (
            <LabelButton
              key={id}
              id={id}
              name={name}
              color={color}
              click={addLabel}
            />
          ))}
        </div>

        {due_date && labels && (
          <div
            style={{
              display: "flex",
              gap: 7.5,
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {labels.map(({ id, name, color }) => (
              <Label
                key={id}
                id={id}
                name={name}
                color={color}
                remove={removeLabel}
              />
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
          {!due_date && labels && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7.5,
                flex: 1,
              }}
            >
              {labels.map(({ id, name, color }) => (
                <Label
                  key={id}
                  id={id}
                  name={name}
                  color={color}
                  remove={removeLabel}
                />
              ))}
            </div>
          )}

          {due_date && (
            <p
              onDoubleClick={handleEditDeadline}
              style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 }}
            >
              <CalendarMarkRemixIcon height="1em"/> {DateUtility.getAbsoluteDate(due_date)}
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
          <motion.a
            onClick={() => remove(id)}
            style={{
              color: tintColor(color, -0.7),
              display: "flex",
              alignItems: "center",
            }}
            whileHover={{ color: tintColor(color, -0.4), scale: 1.1 }}
          >
            {/* Temporary, TODO implement a drag-to-delete recycle bin under the last column */}
            <RecycleBinRemix height="1em" />
          </motion.a>
        </div>
      </motion.div>
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7.5,
          width: "100%",
          fontSize: "0.95em",
          zIndex: 10000,
        }}
      >
        {areCommentsOpen && (
          <>
            <input
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
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              onKeyDown={handleNewComment}
            />
            {comments.map(({ id, content }) => (
              <Comment
                key={id}
                id={id}
                content={content}
                remove={removeComment}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
