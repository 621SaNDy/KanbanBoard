import { useState } from "react";
import { Column } from "./Column";
import type { BoardModel, ColumnModel } from "../types/models";

type BoardProps = BoardModel & {
  remove: (id: number) => void;
};

export function Board({ id, name, columns, remove }: BoardProps) {
  const [items, setItems] = useState<ColumnModel[]>(columns);
  const [newColumnName, setNewColumnName] = useState("");

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log(e.clientX, e.clientY);
  };

  const addColumn = () => {
    const column: ColumnModel = {
      id: Math.round(Math.random() * 1000),
      name: newColumnName,
      position: 2,
      cards: [],
    };
    setItems([...items, column]);
  };

  const removeColumn = (columnId: number) => {
    setItems(items.filter(({ id }: ColumnModel) => id !== columnId));
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
      <h1>{name}</h1>
      {items.map(({ id, name, position, cards }) => (
        <Column
          key={id}
          id={id}
          name={name}
          position={position}
          cards={cards}
          remove={removeColumn}
        />
      ))}

      <input
        type="text"
        placeholder="kolumnejm"
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
      />
      <button onClick={addColumn}>kolum</button>
      <button onClick={() => remove(id)}>bord ziuuu</button>
    </div>
  );
}
