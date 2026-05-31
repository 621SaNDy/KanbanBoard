import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { CardLabel } from "./CardLabel";
import { useEffect, useRef, useState } from "react";
import {
  type CommentModel,
  type CardModel,
  type LabelModel,
} from "../types/models";
import { DateUtility } from "../utilities/DateUtility";
import { ServerConnection } from "../utilities/ServerConnection";
import { CardLabelButton } from "./CardLabelButton";
import { CardComment } from "./CardComment";
import { AutoResizeTextArea } from "./AutoResizeTextArea";
import { type DragCardItem, CARD_DND_TYPE } from "../types/dnd";
import type { LabelBindRequest } from "../types/requests";

type CardProps = CardModel & {
  columnId: number;
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
  due_date: dueDate,
  columnId,
  position,
  availableLabels,
  editTitle,
  editDescription,
  editDueDate,
  remove,
}: CardProps) {
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [isEditingDescription, setEditingDescription] = useState(false);
  const [isEditingDueDate, setEditingDueDate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [labels, setLabels] = useState<LabelModel[]>([]);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [areCommentsOpen, setCommentsOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const [{ isDragging }, dragRef, previewRef] = useDrag<
    DragCardItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: CARD_DND_TYPE,
      item: () => {
        const rect = cardContainerRef.current?.getBoundingClientRect();

        return {
          type: CARD_DND_TYPE,
          cardId: id,
          fromColumnId: columnId,
          fromPosition: position,
          title: title,
          description: description,
          dueDate: dueDate,
          labels: labels,
          width: rect?.width,
          height: rect?.height,
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, columnId, position, title, description, dueDate, labels],
  );

  const dragHandleRef = (node: HTMLHeadingElement | null) => {
    dragRef(node);
  };

  useEffect(() => {
    previewRef(getEmptyImage(), { captureDraggingState: true });
  }, [previewRef]);

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

  const handleTitleTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingTitle(false);
      if ((e.target as HTMLTextAreaElement).value.trim() !== "") {
        editTitle(id, newTitle);
      }
    }
    if (e.key === "Escape") {
      setEditingTitle(false);
    }
  };

  const handleDescriptionTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setEditingDescription(false);
      if (
        (e.target as HTMLTextAreaElement).value.trim().replaceAll("\n", "") !==
        ""
      ) {
        editDescription(id, newDescription);
      }
    }
    if (e.key === "Escape") {
      setEditingDescription(false);
    }
  };

  const handleDueDateInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingDueDate(false);
      if ((e.target as HTMLInputElement).value.trim() !== "") {
        editDueDate(id, newDueDate);
      }
    }
    if (e.key === "Escape") {
      setEditingDueDate(false);
    }
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

  useEffect(() => {
    loadLabels();
    loadComments();
  }, []);

  useEffect(() => {
    if (isEditingTitle && titleTextAreaRef.current) {
      titleTextAreaRef.current.value = title;
      titleTextAreaRef.current.focus();
      titleTextAreaRef.current.select();
      setNewTitle(title);
    }
    if (isEditingDescription && descriptionTextAreaRef.current) {
      descriptionTextAreaRef.current.value = description ?? "";
      descriptionTextAreaRef.current.focus();
      descriptionTextAreaRef.current.select();
      setNewDescription(description ?? "");
    }
    if (isEditingDueDate && dueDateInputRef.current) {
      dueDateInputRef.current.value = dueDate ?? "";
      dueDateInputRef.current.focus();
      dueDateInputRef.current.select();
      setNewDueDate(dueDate ?? "");
    }
  }, [isEditingTitle, isEditingDescription, isEditingDueDate]);

  return (
    <div
      ref={cardContainerRef}
      className="shadow-border-rounded m-border inset-shadow-border bg-bg-secondary flex flex-col relative"
      style={isDragging ? { opacity: 0.5 } : undefined}
    >
      <div className="flex flex-col p-3 relative gap-2 w-full">
        {isEditingTitle ? (
          <AutoResizeTextArea
            className="h3-input"
            rows={1}
            ref={titleTextAreaRef}
            placeholder={title}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value.replaceAll("\n", ""))}
            onKeyDown={handleTitleTextAreaKeyDown}
            onBlur={() => setEditingTitle(false)}
          />
        ) : (
          <h3
            className="select-none cursor-grab active:cursor-grabbing"
            ref={dragHandleRef}
            onDoubleClick={() => setEditingTitle(true)}
          >
            {title}
          </h3>
        )}
        {description &&
          (isEditingDescription ? (
            <AutoResizeTextArea
              className="p-input"
              rows={1}
              ref={descriptionTextAreaRef}
              placeholder={description}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyDown={handleDescriptionTextAreaKeyDown}
              onBlur={() => setEditingDescription(false)}
            />
          ) : (
            <p
              className="whitespace-pre-wrap"
              onDoubleClick={() => setEditingDescription(true)}
            >
              {description}
            </p>
          ))}

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

        {dueDate && labels && (
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
          {!dueDate && labels && (
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

          {dueDate && (
            <div className="flex gap-1">
              <i className="hn hn-clock" />

              {isEditingDueDate ? (
                <input
                  type="date"
                  className="p-input"
                  style={{ border: "none" }}
                  ref={dueDateInputRef}
                  placeholder={dueDate}
                  value={newDueDate}
                  onChange={(e) =>
                    setNewDueDate(e.target.value.replaceAll("\n", ""))
                  }
                  onKeyDown={handleDueDateInputKeyDown}
                  onBlur={() => setEditingDueDate(false)}
                />
              ) : (
                <p
                  className="flex items-center gap-1 flex-1 select-none"
                  onDoubleClick={() => setEditingDueDate(true)}
                >
                  {DateUtility.getAbsoluteDate(dueDate)}
                </p>
              )}
            </div>
          )}
          <div className={`${dueDate ? "flex-1" : ""} flex justify-end gap-1`}>
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
    </div>
  );
}
