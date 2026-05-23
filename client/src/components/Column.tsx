import { Card, type CardData } from "./Card";
import { StretchableText } from "./StretchableText";

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
        backgroundColor: "#e6cc9e",
        borderRadius: 15,
      }}
    >
      <div style={{ height: 100, padding: 10, backgroundColor: "#dbbf8e", borderRadius: 10 }}>
        <StretchableText
          color="#7c6b4e"
          fontFamily="Dugas Pro Black"
          text={title}
        />
      </div>

      {/* <Card
        color="#e6cc9e"
        title={title}
        /> */}

      {cards.map((data, index) => (
        <Card
          key={index}
          color={data.color}
          title={data.title}
          deadline={data.deadline}
          description={data.description}
          comments={data.comments}
          labels={data.labels}
        />
      ))}
    </div>
  );
}
