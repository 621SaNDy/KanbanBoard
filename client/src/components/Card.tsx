import { motion, useDragControls } from "motion/react";
import { CardLabel } from "./CardLabel";
import { useEffect, useRef, useState } from "react";
import {
  type CommentModel,
  type CardModel,
  type LabelModel,
  type LabelBindRequest,
} from "../types/models";
import { DateUtility } from "../utilities/DateUtility";
import { ServerConnection } from "../utilities/ServerConnection";
import { CardLabelButton } from "./CardLabelButton";
import { CardComment } from "./CardComment";

type CardProps = CardModel & {
  availableLabels: LabelModel[];
  editTitle: (id: number, title: string) => void;
  editDescription: (id: number, description: string) => void;
  editDueDate: (id: number, dueDate: string) => void;
  remove: (id: number) => void;
};

export function Card({
  id,
  title,
  description,
  due_date,
  availableLabels,
  editTitle,
  editDescription,
  editDueDate,
  remove,
}: CardProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [labels, setLabels] = useState<LabelModel[]>([]);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [areCommentsOpen, setCommentsOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
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
    const labelData: LabelBindRequest = { labelId: labelId };
    await ServerConnection.post(`/cards/${id}/labels`, labelData);
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

  const handleStartDrag = (event: React.PointerEvent) => {
    dragControls.start(event, { snapToCursor: false });
  };

  useEffect(() => {
    loadLabels();
    loadComments();
  }, []);

  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragTransition={{ power: 0.3 }}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ zIndex: 9999 }}
      className="shadow-border-rounded m-border inset-shadow-border bg-bg-secondary flex flex-col relative"
    >
      <div className="flex flex-col p-3 relative gap-2 w-full">
        <h3
          className="select-none"
          ref={headerRef}
          onDoubleClick={() => editTitle(id, newTitle)}
          onPointerDown={handleStartDrag}
        >
          {title}
        </h3>
        <input
          placeholder="newtitle"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        {description && (
          <>
            <p onDoubleClick={() => editDescription(id, newDescription)}>
              {description}
            </p>
            <input
              placeholder="newdesc"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </>
        )}

        <div className="flex flex-wrap gap-2 flex-1">
          {availableLabels
            .filter(
              (available) =>
                !labels.map((current) => current.id).includes(available.id),
            )
            .map(({ id, name, color }) => (
              <CardLabelButton
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
              <CardLabel
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
                <CardLabel
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
            <>
              <p
                className="flex items-center gap-1 flex-1"
                onDoubleClick={() => editDueDate(id, newDueDate)}
              >
                <i className="hn hn-clock" />{" "}
                {DateUtility.getAbsoluteDate(due_date)}
              </p>
              <input
                type="date"
                placeholder="newdate"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </>
          )}

          <a
            className="flex items-center"
            onClick={() => setCommentsOpen(!areCommentsOpen)}
          >
            <i className="hn hn-comments" />
          </a>
          <a className="flex items-center" onClick={() => remove(id)}>
            {/* Temporary, TODO implement a drag-to-delete recycle bin under the last column (or not?) */}
            <i className="hn hn-trash-alt" />
          </a>
        </div>
      </div>

      {areCommentsOpen && (
        <div className="flex flex-col items-stretch gap-2 w-full pl-3 pr-3 pb-3">
          {comments.map(({ id, content }) => (
            <CardComment
              key={id}
              id={id}
              content={content}
              remove={removeComment}
            />
          ))}
          <input
            placeholder="Write a comment..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            onKeyDown={handleNewComment}
          />
        </div>
      )}
    </motion.div>
  );
}
