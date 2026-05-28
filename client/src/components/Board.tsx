import { useEffect, useState } from "react";
import { Column } from "./Column";
import type {
  BoardModel,
  ColumnModel,
  ColumnWithCardsModel,
} from "../types/models";
import { fetchServer } from "../utilities/fetchServer";

type BoardProps = BoardModel & {
  remove: (id: number) => void;
};

export function Board({ id, name, remove }: BoardProps) {
  const [items, setItems] = useState<ColumnModel[]>([]);
  const [newColumnName, setNewColumnName] = useState("");

  const fetchColumns = async () => {
    return await fetchServer(`/boards/${id}/columns`);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log(e.clientX, e.clientY);
  };

  const addColumn = () => {
    const column: ColumnWithCardsModel = {
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

  useEffect(() => {
    const loadColumns = async () => {
      const columns: ColumnModel[] = await fetchColumns();
      setItems(columns);
    };
    loadColumns();
  }, []);

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
      {items.map(({ id, name, position }) => (
        <Column
          key={id}
          id={id}
          name={name}
          position={position}
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
