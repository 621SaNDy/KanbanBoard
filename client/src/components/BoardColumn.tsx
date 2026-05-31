import { Card } from "./Card";
import { useEffect, useRef, useState } from "react";
import type {
  CardModel,
  CardRequest,
  CardUpdateRequest,
  ColumnModel,
  LabelModel,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import { AutoResizeTextArea } from "./AutoResizeTextArea";

type BoardColumnProps = ColumnModel & {
  availableLabels: LabelModel[];
  editName: (id: number, name: string) => void;
  remove: (id: number) => void;
};

export function BoardColumn({
  id,
  name,
  availableLabels,
  editName,
  remove,
}: BoardColumnProps) {
  const [isEditingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [cards, setCards] = useState<CardModel[]>([]);
  const nameTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const loadCards = async () => {
    const newCards = await ServerConnection.get(`/columns/${id}/cards`);
    setCards(newCards);
  };

  const addCard = async () => {
    const cardData: CardRequest = {
      title: "New card",
      description: "New card description",
      due_date: "2026-04-21",
    };
    await ServerConnection.post(`/columns/${id}/cards`, cardData);
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

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (isEditingName && nameTextAreaRef.current) {
      nameTextAreaRef.current.value = name;
      nameTextAreaRef.current.focus();
      nameTextAreaRef.current.select();
      setNewName(name);
    }
  }, [isEditingName]);

  return (
    <div className="shadow-border-rounded m-border inset-shadow-border flex flex-col gap-3 p-3 flex-1">
      <div className="flex flex-col gap-2 text-center">
        {isEditingName ? (
          <AutoResizeTextArea
            className="h2-input"
            rows={1}
            ref={nameTextAreaRef}
            placeholder={name}
            value={newName}
            onChange={(e) => setNewName(e.target.value.replaceAll("\n", ""))}
            onKeyDown={handleNameTextAreaKeyDown}
            onBlur={() => setEditingName(false)}
          />
        ) : (
          <h2 onDoubleClick={() => setEditingName(true)}>{name}</h2>
        )}
        <button onClick={() => remove(id)}>kolum ziuuu</button>
        <button
          className="shadow-border-rounded inset-shadow-border m-border flex justify-center p-2"
          onClick={addCard}
        >
          <i className="hn hn-plus" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {cards.map(
          ({
            id,
            title,
            description,
            due_date,
            position,
            labels,
            comments,
          }) => (
            <Card
              key={id}
              id={id}
              title={title}
              description={description}
              due_date={due_date}
              position={position}
              labels={labels}
              comments={comments}
              availableLabels={availableLabels}
              editTitle={editCardTitle}
              editDescription={editCardDescription}
              editDueDate={editCardDueDate}
              remove={removeCard}
            />
          ),
        )}
      </div>
    </div>
  );
}
