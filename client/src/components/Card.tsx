import { motion, useDragControls } from "motion/react";
import { StretchableText } from "./StretchableText";
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
      whileDrag={{ zIndex: 9999 }}
      onDrag={handleShrinkOnDrag}
      onDragEnd={handleExpandOnDragEnd}
      className="background-lighter flex flex-col justify-center relative"
    >
      <div className="p-3 absolute inset-0 z-0 pointer-events-none">
        <StretchableText
          text={title.split(" ")[0]}
          color={"#aaa"}
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
        transition={{ duration: 0.2 }}
        className="flex flex-col p-3 relative gap-2 w-full z-1"
      >
        <div className="flex flex-col pt-2 pb-3">
          <h3
            ref={headerRef}
            onDoubleClick={handleEditTitle}
            onPointerDown={handleStartDrag}
            className="select-none"
          >
            {title}
          </h3>
          {description && (
            <p onDoubleClick={handleEditDescription}>{description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 flex-1">
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
          <div className="flex flex-wrap gap-2 flex-1">
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

        <div className="flex justify-end gap-1">
          {!due_date && labels && (
            <div className="flex flex-wrap flex-1">
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
              className="flex items-center gap-1 flex-1"
            >
              <CalendarMarkRemixIcon height="1em" />{" "}
              {DateUtility.getAbsoluteDate(due_date)}
            </p>
          )}

          <motion.a
            onClick={() => setCommentsOpen(!areCommentsOpen)}
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
          >
            <ChatBubbleTextSquareRemixIcon height="1em" />
          </motion.a>
          <motion.a
            onClick={() => remove(id)}
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
          >
            {/* Temporary, TODO implement a drag-to-delete recycle bin under the last column (or not?) */}
            <RecycleBinRemix height="1em" />
          </motion.a>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col items-stretch p-2 w-full"
        style={{ zIndex: 10000 }}
      >
        {areCommentsOpen && (
          <>
            <input
              placeholder="Write a comment..."
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
