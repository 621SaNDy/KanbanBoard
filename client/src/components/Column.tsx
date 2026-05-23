import { Reorder } from "motion/react";
import { Card, type CardData } from "./Card";
import { StretchableText } from "./StretchableText";
import { useState } from "react";

type ColumnData = {
  title: string;
  cards: CardData[];
};

export function Column({ title, cards }: ColumnData) {
  type ColumnItem = CardData & { id: string };

  // TODO add ID to CardData as the DB has it already
  const [items, setItems] = useState<ColumnItem[]>(
    cards.map((card, index) => ({
      id: (card as ColumnItem).id ?? (index + 1).toString(),
      ...card,
    })),
  );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: 10,
        flexDirection: "column",
        padding: 10,
        backgroundColor: "#e6cc9e",
        borderRadius: 15,
      }}
    >
      <div
        style={{
          paddingTop: 10,
          paddingInline: 10,
          textAlign: "center",
          backgroundColor: "#dbbf8e",
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

      <Reorder.Group
        values={items}
        onReorder={setItems}
        as="div"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {items.map((data) => (
          <Reorder.Item drag key={data.id} value={data} as="div">
            <Card
              title={data.title}
              color={data.color}
              description={data.description}
              deadline={data.deadline}
              labels={data.labels}
              comments={data.comments}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
