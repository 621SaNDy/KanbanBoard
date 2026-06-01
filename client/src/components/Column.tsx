import { Card } from "./Card";
import { useDrop } from "react-dnd";
import { Fragment, useEffect, useRef, useState } from "react";
import type { CardModel, ColumnModel, LabelModel } from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import { AutoResizeTextArea } from "./AutoResizeTextArea";
import { CardDropIndicator } from "./CardDropIndicator";
import { type DragCardItem, CARD_DND_TYPE } from "../types/dnd";
import type {
  CardRequest,
  CardUpdateRequest,
  CardMoveRequest,
} from "../types/requests";
import { HoverableIcon } from "./HoverableIcon";
import { DateUtility } from "../utilities/DateUtility";

type ColumnProps = ColumnModel & {
  availableLabels: LabelModel[];
  refreshToken: number;
  editName: (id: number, name: string) => void;
  remove: (id: number) => void;
  refreshBoard: () => void;
  filterLabelIds: number[];
  isFilteringActive: boolean;
  isWarningEnabled?: boolean;
  searchedText?: string;
  isAutoNameEditEnabled?: boolean;
  autoNameEditUsed?: () => void;
};

export function Column({
  id,
  name,
  availableLabels,
  refreshToken,
  editName,
  remove,
  refreshBoard,
  filterLabelIds,
  isFilteringActive,
  isWarningEnabled,
  searchedText = "",
  isAutoNameEditEnabled,
  autoNameEditUsed,
}: ColumnProps) {
  const [isEditingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [cards, setCards] = useState<CardModel[]>([]);
  const [cardLabelIdsByCardId, setCardLabelIdsByCardId] = useState<
    Record<number, number[]>
  >({});
  const [isFilterReady, setFilterReady] = useState(false);
  const [closestDropIndex, setClosestDropIndex] = useState<number | null>(null);
  const [autoEditCardId, setAutoEditCardId] = useState(0);
  const nameTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const cardRefs = useRef(new Map<number, HTMLDivElement | null>());

  const loadCards = async () => {
    const newCards = await ServerConnection.get(`/columns/${id}/cards`);
    setCards(newCards);
  };

  const addCard = async () => {
    if (isFilteringActive) {
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const dueDate = date.toISOString().split("T")[0];
    const cardData: CardRequest = {
      title: "A new task, yay!",
      description: "May the retro gothic 8-bit brutalist UI be with you!",
      due_date: dueDate,
    };
    const newCard: CardModel = await ServerConnection.post(
      `/columns/${id}/cards`,
      cardData,
    );
    setAutoEditCardId(newCard.id);
    loadCards();
  };

  const editCardTitle = async (cardId: number, title: string) => {
    const cardData: CardUpdateRequest = { title: title };
    await ServerConnection.patch(`/cards/${cardId}`, cardData);
    loadCards();
  };

  const editCardDescription = async (cardId: number, description: string) => {
    const cardData: CardUpdateRequest = { description: description };
    await ServerConnection.patch(`/cards/${cardId}`, cardData);
    loadCards();
  };

  const editCardDueDate = async (cardId: number, dueDate: string) => {
    const cardData: CardUpdateRequest = { due_date: dueDate };
    await ServerConnection.patch(`/cards/${cardId}`, cardData);
    loadCards();
  };

  const removeCard = async (cardId: number) => {
    await ServerConnection.delete(`/cards/${cardId}`);
    loadCards();
  };

  const handleNameTextAreaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingName(false);
      if ((e.target as HTMLTextAreaElement).value.trim() !== "") {
        editName(id, newName);
      }
    }
    if (e.key === "Escape") {
      setEditingName(false);
    }
  };

  const moveCard = async (
    cardId: number,
    columnId: number,
    position: number,
  ) => {
    if (isFilteringActive) {
      return;
    }
    const cardData: CardMoveRequest = {
      columnId: columnId,
      position: position,
    };
    await ServerConnection.patch(`/cards/${cardId}/move`, cardData);
    refreshBoard();
  };

  const getDropZoneIndex = (clientY: number) => {
    if (cards.length === 0) {
      return 0;
    }
    for (let index = 0; index < cards.length; index += 1) {
      const cardId = cards[index]?.id;
      if (!cardId) {
        continue;
      }
      const node = cardRefs.current.get(cardId);
      if (!node) {
        continue;
      }
      const rect = node.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      if (clientY < centerY) {
        return Math.max(index, 0);
      }
    }
    return cards.length;
  };

  const getInsertionIndex = (zoneIndex: number, draggingCardId?: number) => {
    const currentIndex = draggingCardId
      ? cards.findIndex((card) => card.id === draggingCardId)
      : -1;

    if (currentIndex !== -1 && zoneIndex > currentIndex) {
      return zoneIndex - 1;
    }
    return zoneIndex;
  };

  const getDropPlacement = (
    clientY: number | null,
    draggingCardId?: number,
  ) => {
    const zoneIndex =
      clientY !== null ? getDropZoneIndex(clientY) : cards.length;
    const insertionIndex = getInsertionIndex(zoneIndex, draggingCardId);
    return { zoneIndex, nextPosition: insertionIndex + 1 };
  };

  const [{ isOver }, dropRef] = useDrop<
    DragCardItem,
    void,
    { isOver: boolean }
  >(
    () => ({
      accept: CARD_DND_TYPE,
      canDrop: () => !isFilteringActive,
      hover: (_, monitor) => {
        if (isFilteringActive) {
          return;
        }
        const offset = monitor.getClientOffset();
        if (!offset) {
          return;
        }
        setClosestDropIndex(getDropPlacement(offset.y).zoneIndex);
      },
      drop: (item, monitor) => {
        if (isFilteringActive) {
          return;
        }
        const placement = getDropPlacement(
          monitor.getClientOffset()?.y ?? null,
          item.cardId,
        );
        if (
          item.fromColumnId === id &&
          item.fromPosition === placement.nextPosition
        ) {
          setClosestDropIndex(null);
          return;
        }
        moveCard(item.cardId, id, placement.nextPosition);
        setClosestDropIndex(null);
      },
      collect: (monitor) => ({
        isOver: !isFilteringActive && monitor.isOver(),
      }),
    }),
    [cards, id, isFilteringActive, refreshBoard],
  );

  const dropTargetRef = (node: HTMLDivElement | null) => {
    dropRef(node);
  };

  const setCardRef = (cardId: number) => (node: HTMLDivElement | null) => {
    if (node) {
      cardRefs.current.set(cardId, node);
    } else {
      cardRefs.current.delete(cardId);
    }
  };

  useEffect(() => {
    if (!isOver) {
      setClosestDropIndex(null);
    }
  }, [isOver]);

  useEffect(() => {
    loadCards();
  }, [id, refreshToken]);

  useEffect(() => {
    if (isEditingName && nameTextAreaRef.current) {
      nameTextAreaRef.current.value = name;
      nameTextAreaRef.current.focus();
      nameTextAreaRef.current.select();
      setNewName(name);
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isAutoNameEditEnabled) {
      setEditingName(true);
      autoNameEditUsed?.();
    }
  }, [isAutoNameEditEnabled, autoNameEditUsed]);

  const filteredCards =
    isFilteringActive && isFilterReady
      ? cards.filter((card: CardModel) => {
          if (filterLabelIds.length === 0) {
            return true;
          }
          const cardLabelIds = cardLabelIdsByCardId[card.id] ?? [];
          return cardLabelIds.some((labelId) =>
            filterLabelIds.includes(labelId),
          );
        })
      : cards;

  const visibleCards = searchedText
    ? filteredCards.filter((card: CardModel) => {
        return (
          card.title.toLowerCase().includes(searchedText.toLowerCase()) ||
          card.description
            ?.toLowerCase()
            .includes(searchedText.toLowerCase()) ||
          (card.due_date
            ? DateUtility.getAbsoluteDate(card.due_date)
                .toLowerCase()
                .includes(searchedText.toLowerCase())
            : false)
        );
      })
    : filteredCards;

  useEffect(() => {
    if (!isFilteringActive) {
      setFilterReady(false);
      return;
    }
    let isCurrent = true;

    const loadCardLabelIds = async () => {
      if (cards.length === 0) {
        if (isCurrent) {
          setCardLabelIdsByCardId({});
          setFilterReady(true);
        }
        return;
      }
      setFilterReady(false);

      const entries = await Promise.all(
        cards.map(async (card) => {
          const labels = await ServerConnection.get(`/cards/${card.id}/labels`);
          return {
            cardId: card.id,
            labelIds: (labels as LabelModel[]).map((label) => label.id),
          };
        }),
      );
      if (!isCurrent) {
        return;
      }
      const next: Record<number, number[]> = {};
      entries.forEach(({ cardId, labelIds }) => {
        next[cardId] = labelIds;
      });
      setCardLabelIdsByCardId(next);
      setFilterReady(true);
    };
    loadCardLabelIds();

    return () => {
      isCurrent = false;
    };
  }, [cards, isFilteringActive]);

  return (
    <div className="shadow-border-bg-dark-rounded m-border flex flex-col gap-1 p-2 flex-1 min-h-0 bg-bg-dark">
      <div className="flex flex-col gap-3 text-center">
        <div className="flex gap-2 items-start">
          <a className="flex items-center opacity-0">
            <HoverableIcon name="trash-alt" />
          </a>
          {isEditingName ? (
            <AutoResizeTextArea
              className="h2-input column-title w-full min-w-0 flex-1"
              rows={1}
              ref={nameTextAreaRef}
              placeholder={name}
              value={newName}
              onChange={(e) => setNewName(e.target.value.replaceAll("\n", ""))}
              onKeyDown={handleNameTextAreaKeyDown}
              onBlur={() => setEditingName(false)}
            />
          ) : (
            <h2
              className="column-title pl-1 pr-1 w-full min-w-0 flex-1"
              onDoubleClick={() => setEditingName(true)}
            >
              {name}
            </h2>
          )}
          <a className="flex items-center" onClick={() => remove(id)}>
            <HoverableIcon name="trash-alt" />
          </a>
        </div>
        <button
          className={`shadow-border-rounded inset-shadow-border m-border flex justify-center p-2 ${
            isFilteringActive ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={isFilteringActive ? undefined : addCard}
          disabled={isFilteringActive}
        >
          <HoverableIcon name="plus" useHover={false} />
        </button>
      </div>

      <div
        ref={dropTargetRef}
        className="flex flex-col flex-1 gap-1 overflow-auto"
      >
        <CardDropIndicator active={isOver && closestDropIndex === 0} />
        {visibleCards.map(
          (
            {
              id: cardId,
              title,
              description,
              due_date,
              position,
              labels,
              comments,
            },
            index,
          ) => (
            <Fragment key={cardId}>
              <div ref={setCardRef(cardId)}>
                <Card
                  id={cardId}
                  title={title}
                  description={description}
                  due_date={due_date}
                  position={position}
                  columnId={id}
                  labels={labels}
                  comments={comments}
                  availableLabels={availableLabels}
                  editTitle={editCardTitle}
                  editDescription={editCardDescription}
                  editDueDate={editCardDueDate}
                  remove={removeCard}
                  isDragDisabled={isFilteringActive}
                  isAutoTitleEditEnabled={autoEditCardId === cardId}
                  autoTitleEditUsed={() => setAutoEditCardId(0)}
                  isDueSoonWarningEnabled={isWarningEnabled}
                />
              </div>
              <CardDropIndicator
                active={isOver && closestDropIndex === index + 1}
              />
            </Fragment>
          ),
        )}
      </div>
    </div>
  );
}
