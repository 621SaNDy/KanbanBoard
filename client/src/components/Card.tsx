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
import { HoverableIcon } from "./HoverableIcon";

type CardProps = CardModel & {
  columnId: number;
  availableLabels: LabelModel[];
  editTitle: (id: number, title: string) => void;
  editDescription: (id: number, description: string | null) => void;
  editDueDate: (id: number, dueDate: string | null) => void;
  remove: (id: number) => void;
  isDragDisabled?: boolean;
  isAutoTitleEditEnabled?: boolean;
  autoTitleEditUsed?: () => void;
  isDueSoonWarningEnabled?: boolean;
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
  isDragDisabled = false,
  isAutoTitleEditEnabled,
  autoTitleEditUsed,
  isDueSoonWarningEnabled = false,
}: CardProps) {
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [isEditingDescription, setEditingDescription] = useState(false);
  const [isEditingDueDate, setEditingDueDate] = useState(false);
  const [isEditingLabels, setEditingLabels] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState<string | null>(null);
  const [newDueDate, setNewDueDate] = useState<string | null>(null);
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
      canDrag: !isDragDisabled,
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
        isDragging: !isDragDisabled && monitor.isDragging(),
      }),
    }),
    [
      id,
      columnId,
      position,
      title,
      description,
      dueDate,
      labels,
      isDragDisabled,
    ],
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
      editDescription(id, newDescription);
    }
    if (e.key === "Escape") {
      setEditingDescription(false);
    }
    if (e.key === "Delete" || (e.ctrlKey && e.key === "Backspace")) {
      setEditingDescription(false);
      editDescription(id, null);
    }
  };

  const handleDueDateInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingDueDate(false);
      editDueDate(id, newDueDate);
    }
    if (e.key === "Escape") {
      setEditingDueDate(false);
    }
    if (e.key === "Delete" || (e.ctrlKey && e.key === "Backspace")) {
      setEditingDueDate(false);
      editDueDate(id, null);
    }
  };

  const handleNewComment = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (newCommentContent.trim() !== "") {
        await ServerConnection.post(`/cards/${id}/comments`, {
          content: newCommentContent,
        });
        setNewCommentContent("");
        loadComments();
      }
    }
    if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  useEffect(() => {
    loadLabels();
    loadComments();
  }, []);

  const { isOverdue, isDueSoon } = (() => {
    let overdue = false;
    let soon = false;
    if (!dueDate || !isDueSoonWarningEnabled) {
      return { isOverdue: false, isDueSoon: false };
    }
    try {
      const due = new Date(dueDate);
      const now = new Date();
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffMs = due.getTime() - now.getTime();
      if (diffMs < 0) {
        overdue = true;
      } else if (diffMs <= 3 * msPerDay) {
        soon = true;
      }
    } catch {}
    return { isOverdue: overdue, isDueSoon: soon };
  })();

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

  useEffect(() => {
    if (isAutoTitleEditEnabled) {
      setEditingTitle(true);
      autoTitleEditUsed?.();
    }
  }, [isAutoTitleEditEnabled, autoTitleEditUsed]);

  return (
    <div
      ref={cardContainerRef}
      className={`shadow-border-rounded m-border inset-shadow-border ${
        isOverdue ? "bg-bg-error" : isDueSoon ? "bg-bg-warning" : "bg-bg-dark"
      } flex flex-col relative min-w-0`}
      style={isDragging ? { opacity: 0.5 } : undefined}
    >
      <div className="flex flex-col pt-2 pb-2 pl-2 pr-1 relative gap-2 w-full min-w-0">
        {isEditingTitle ? (
          <AutoResizeTextArea
            className="h3-input card-title w-full min-w-0"
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
            className={`card-title pl-1 pr-1 select-none ${
              isDragDisabled
                ? "cursor-default"
                : "cursor-grab active:cursor-grabbing"
            }`}
            ref={dragHandleRef}
            onDoubleClick={() => setEditingTitle(true)}
          >
            {title}
          </h3>
        )}
        {isEditingDescription ? (
          <AutoResizeTextArea
            className="p-input card-description w-full min-w-0"
            rows={1}
            ref={descriptionTextAreaRef}
            placeholder={description}
            value={newDescription ?? ""}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={handleDescriptionTextAreaKeyDown}
            onBlur={() => setEditingDescription(false)}
          />
        ) : (
          description && (
            <p
              className="pl-1 pr-1 card-description whitespace-pre-wrap"
              onDoubleClick={() => setEditingDescription(true)}
            >
              {description}
            </p>
          )
        )}

        {isEditingLabels && (
          <div className="flex flex-wrap gap-2 flex-1 pl-1 pr-1">
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
                  icon="plus"
                  click={addLabel}
                />
              ))}
            {labels.map(({ id, name, color }) => (
              <CardLabelButton
                key={id}
                id={id}
                name={name}
                color={color}
                icon="minus"
                click={removeLabel}
              />
            ))}
          </div>
        )}

        {!isEditingLabels &&
          (dueDate || isEditingDueDate) &&
          labels.length > 0 && (
            <div
              className="flex flex-wrap gap-2 flex-1 pl-1 pr-1"
              onDoubleClick={() => setEditingLabels(true)}
            >
              {labels.map(({ id, name, color }) => (
                <CardLabel key={id} id={id} name={name} color={color} />
              ))}
            </div>
          )}

        <div className="flex justify-end gap-1 pl-1 pr-1">
          {!isEditingLabels &&
            !isEditingDueDate &&
            !dueDate &&
            labels.length > 0 && (
              <div
                className="flex flex-wrap flex-1 gap-2"
                onDoubleClick={() => setEditingLabels(true)}
              >
                {labels.map(({ id, name, color }) => (
                  <CardLabel key={id} id={id} name={name} color={color} />
                ))}
              </div>
            )}

          <div className="flex flex-1 w-full justify-start">
            {(dueDate || isEditingDueDate) && (
              <HoverableIcon name="clock" useHover={false} />
            )}
            {isEditingDueDate ? (
              <input
                type="date"
                className="p-input w-full flex-1 min-w-0 mr-1"
                style={{ border: "none" }}
                ref={dueDateInputRef}
                placeholder={dueDate}
                value={newDueDate ?? ""}
                onChange={(e) =>
                  setNewDueDate(e.target.value.replaceAll("\n", ""))
                }
                onKeyDown={handleDueDateInputKeyDown}
                onBlur={() => setEditingDueDate(false)}
              />
            ) : (
              dueDate && (
                <p
                  className="pl-1 pr-1 flex items-center gap-1 flex-1 select-none"
                  onDoubleClick={() => setEditingDueDate(true)}
                >
                  {DateUtility.getAbsoluteDate(dueDate)}
                </p>
              )
            )}
          </div>

          <div className="flex justify-end gap-1">
            {!isEditingDescription && !description && (
              <a
                className="flex items-center gap-1"
                onClick={() => setEditingDescription(true)}
              >
                <HoverableIcon name="align-left" />
              </a>
            )}
            {!isEditingDueDate && !dueDate && (
              <a
                className="flex items-center gap-1"
                onClick={() => setEditingDueDate(true)}
              >
                <HoverableIcon name="clock" />
              </a>
            )}
            <a
              className="flex items-center gap-1"
              onClick={() => setEditingLabels(!isEditingLabels)}
            >
              <HoverableIcon name="hashtag" alwaysHover={isEditingLabels} />
            </a>
            <a
              className="flex items-center"
              onClick={() => setCommentsOpen(!areCommentsOpen)}
            >
              <HoverableIcon
                name="comment-dots"
                alwaysHover={areCommentsOpen}
              />
            </a>
            <a className="flex items-center" onClick={() => remove(id)}>
              <HoverableIcon name="trash-alt" />
            </a>
          </div>
        </div>
      </div>

      {areCommentsOpen && (
        <div className="flex flex-col items-stretch gap-2 w-full pt-1 pl-2 pr-2 pb-2">
          {comments.length > 0 && (
            <div className="flex flex-col items-stretch gap-2 w-full pl-1">
              {comments.map(({ id, content }) => (
                <CardComment
                  key={id}
                  id={id}
                  content={content}
                  remove={removeComment}
                />
              ))}
            </div>
          )}
          <input
            className="border-3 border-fg border-solid"
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
