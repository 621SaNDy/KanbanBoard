import { Reorder } from "motion/react";
import { Card, type CardData } from "./Card";
import { StretchableText } from "./StretchableText";
import { useState } from "react";

type ColumnData = {
  title: string;
  cards: CardData[];
};

export function Column({ title, cards }: ColumnData) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: 10,
        flexDirection: "column",
        padding: 10,
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
        <h2>{title}</h2>
        {/* <StretchableText
          color="#7c6b4e"
          fontFamily="Dugas Pro Black"
          text={title}
        /> */}
      </div>

      {/* <Card
        color="#e6cc9e"
        title={title}
        /> */}

      {cards.map((data, index) => (
        <Card
          key={index}
          title={data.title}
          color={data.color}
          description={data.description}
          deadline={data.deadline}
          labels={data.labels}
          comments={data.comments}
        />
      ))}
    </div>
  );
}
