import { motion } from "motion/react";
import { Card } from "./Card";
import { useEffect, useState } from "react";
import type { CardModel, CardRequest, ColumnModel } from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";

type ColumnProps = ColumnModel & {
  remove: (columnId: number) => void;
};

export function Column({ id, name, remove }: ColumnProps) {
  const [items, setItems] = useState<CardModel[]>([]);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState<string>("");
  const [newCardDueDate, setNewCardDueDate] = useState<string>("");

  const loadCards = async () => {
    const cards = await ServerConnection.get(`/columns/${id}/cards`);
    setItems(cards);
  };

  const addCard = async () => {
    const card: CardRequest = {
      title: newCardTitle,
      description: newCardDescription,
      due_date: newCardDueDate,
    };
    await ServerConnection.post(`/columns/${id}/cards`, card);
    loadCards();
  };

  const removeCard = async (cardId: number) => {
    await ServerConnection.delete(`/cards/${cardId}`);
    loadCards();
  };

  useEffect(() => {
    loadCards();
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: 10,
        padding: 10,
        flexDirection: "column",
        backgroundColor: "#dfd8ce",
        borderRadius: 15,
      }}
    >
      <div
        style={{
          paddingTop: 10,
          paddingInline: 10,
          textAlign: "center",
          backgroundColor: "#cec6ba",
          borderRadius: 10,
        }}
      >
        <h2>{name}</h2>
        <button
          style={{
            padding: 5,
            backgroundColor: "#c1b9ae",
            border: "none",
            borderRadius: 5,
          }}
          onClick={() => remove(id)}
        >
          kolum ziuuu
        </button>
      </div>

      <div
        style={{
          padding: 10,
          textAlign: "center",
          backgroundColor: "#cec6ba",
          borderRadius: 10,
        }}
      >
        <input
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
          type="datetime-local"
          placeholder="dejdlajn"
          value={newCardDueDate}
          onChange={(e) => setNewCardDueDate(e.target.value)}
        />
        <button
          style={{
            padding: 5,
            backgroundColor: "#c1b9ae",
            border: "none",
            borderRadius: 5,
          }}
          onClick={addCard}
        >
          czard
        </button>
      </div>

      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map(
          ({
            id,
            title,
            description,
            due_date: dueDate,
            position,
            labels,
            comments,
          }) => (
            <Card
              key={id}
              id={id}
              title={title}
              description={description}
              due_date={dueDate}
              position={position}
              labels={labels}
              comments={comments}
              remove={removeCard}
            />
          ),
        )}
      </motion.div>
    </div>
  );
}
