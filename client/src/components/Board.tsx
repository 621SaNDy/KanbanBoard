import { useState } from "react";
import { Column, type ColumnData } from "./Column";

type BoardData = {
  id: number;
  name: string;
  columns: ColumnData[];
};

export function Board({ id, name, columns }: BoardData) {
  const [items, setItems] = useState<ColumnData[]>(columns);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log(e.clientX, e.clientY);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        gap: 10,
        padding: 10,
      }}
      onPointerMove={handlePointerMove}
    >
      {items.map(({ id, name, position, cards }) => (
        <Column
          key={id}
          id={id}
          name={name}
          position={position}
          cards={cards}
        />
      ))}
    </div>
  );
}
