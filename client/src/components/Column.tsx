import { motion } from "motion/react";
import { Card } from "./Card";
import { useState } from "react";
import type { CardModel, ColumnModel } from "../types/models";

type ColumnProps = ColumnModel & {
  remove: (columnId: number) => void;
};

export function Column({ id, name, cards, remove }: ColumnProps) {
  const [items, setItems] = useState<CardModel[]>(cards);

  const addCard = () => {
    const card: CardModel = {
      id: Math.round(Math.random() * 1000),
      title: "hejak",
      description: "ueueueueueue eueueueueueu",
      dueDate: "nima",
      position: 1,
      labels: [
        { id: 1, name: "bybybyb", color: "#ff00ff" },
        { id: 2, name: "heh", color: "#00ffff" },
      ],
    };
    setItems([card, ...items]);
  };

  const removeCard = (cardId: number) => {
    setItems(items.filter(({ id }: CardModel) => id !== cardId));
  };

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
        <button onClick={addCard}>czard</button>
        <button onClick={() => remove(id)}>kolum ziuuu</button>
      </div>

      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map(
          ({ id, title, description, dueDate, position, labels, comments }) => (
            <Card
              key={id}
              id={id}
              title={title}
              description={description}
              dueDate={dueDate}
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
