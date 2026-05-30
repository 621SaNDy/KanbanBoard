import { Card } from "./Card";
import { useEffect, useState } from "react";
import type {
  CardModel,
  CardRequest,
  ColumnModel,
  LabelModel,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";

type BoardColumnProps = ColumnModel & {
  availableLabels: LabelModel[];
  remove: (columnId: number) => void;
};

export function BoardColumn({
  id,
  name,
  availableLabels,
  remove,
}: BoardColumnProps) {
  const [cards, setCards] = useState<CardModel[]>([]);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState<string>("");
  const [newCardDueDate, setNewCardDueDate] = useState<string>("");

  const loadCards = async () => {
    const newCards = await ServerConnection.get(`/columns/${id}/cards`);
    setCards(newCards);
  };

  const addCard = async () => {
    const card: CardRequest = {
      title: newCardTitle,
      description: newCardDescription,
      due_date: newCardDueDate,
    };
    await ServerConnection.post(`/columns/${id}/cards`, card);
    setNewCardTitle("");
    setNewCardDescription("");
    setNewCardDueDate("");
    loadCards();
  };

  const removeCard = async (cardId: number) => {
    await ServerConnection.delete(`/cards/${cardId}`);
    loadCards();
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <div className="shadow-border-rounded m-border inset-shadow-border flex flex-col gap-3 p-3 flex-1">
      <div className="flex flex-col gap-2 text-center">
        <h2>{name}</h2>
        {/* <button onClick={() => remove(id)}>kolum ziuuu</button> */}
        {/* <input
          type="text"
          placeholder="titel"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="deskripszyn"
          value={newCardDescription}
          onChange={(e) => setNewCardDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="dejdlajn"
          value={newCardDueDate}
          onChange={(e) => setNewCardDueDate(e.target.value)}
        /> */}
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
              remove={removeCard}
            />
          ),
        )}
      </div>
    </div>
  );
}
