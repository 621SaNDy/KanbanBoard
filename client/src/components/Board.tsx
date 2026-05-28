import { useEffect, useState } from "react";
import { Column } from "./Column";
import type { BoardModel, ColumnModel, ColumnRequest } from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";

type BoardProps = BoardModel & {
  remove: (id: number) => void;
};

export function Board({ id, name, remove }: BoardProps) {
  const [items, setItems] = useState<ColumnModel[]>([]);
  const [newColumnName, setNewColumnName] = useState("");

  const loadColumns = async () => {
    const columns = await ServerConnection.get(`/boards/${id}/columns`);
    setItems(columns);
  };

  const addColumn = async () => {
    const column: ColumnRequest = {
      name: newColumnName,
    };
    await ServerConnection.post(`/boards/${id}/columns`, column);
    loadColumns();
  };

  const removeColumn = async (columnId: number) => {
    await ServerConnection.delete(`/columns/${columnId}`);
    loadColumns();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log(e.clientX, e.clientY);
  };

  useEffect(() => {
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
