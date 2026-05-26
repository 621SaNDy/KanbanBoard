import { motion } from "motion/react";
import { Card, type CardData } from "./Card";
import { useState } from "react";

export type ColumnData = {
  id: number;
  name: string;
  position: number;
  cards: CardData[];
};

export function Column({ id, name, cards }: ColumnData) {
  const [items, setItems] = useState<CardData[]>(cards);

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
      </div>

      <motion.div
        layout
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map(
          ({ id, title, color, description, dueDate, labels, comments }) => (
            <Card
              key={id}
              id={id}
              title={title}
              color={color}
              description={description}
              dueDate={dueDate}
              labels={labels}
              comments={comments}
            />
          ),
        )}
      </motion.div>
    </div>
  );
}
