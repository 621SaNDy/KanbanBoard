import { useEffect, useState } from "react";
import { Column } from "./Column";
import {
  type LabelModel,
  type BoardModel,
  type ColumnModel,
  type ColumnRequest,
  type LabelRequest,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import { Label } from "./Label";

type BoardProps = BoardModel & {
  remove: (id: number) => void;
};

export function Board({ id, name, remove }: BoardProps) {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [labels, setLabels] = useState<LabelModel[]>([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("");

  const loadColumns = async () => {
    const newColumns = await ServerConnection.get(`/boards/${id}/columns`);
    setColumns(newColumns);
  };

  const loadLabels = async () => {
    const newLabels = await ServerConnection.get(`/boards/${id}/labels`);
    setLabels(newLabels);
  };

  const addColumn = async () => {
    const column: ColumnRequest = { name: newColumnName };
    await ServerConnection.post(`/boards/${id}/columns`, column);
    setNewColumnName("");
    loadColumns();
  };

  const removeColumn = async (columnId: number) => {
    await ServerConnection.delete(`/columns/${columnId}`);
    loadColumns();
  };

  const addLabel = async () => {
    const label: LabelRequest = {
      name: newLabelName,
      color: newLabelColor,
    };
    await ServerConnection.post(`/boards/${id}/labels`, label);
    setNewLabelName("");
    setNewLabelColor("");
    loadLabels();
  };

  const removeLabel = async (labelId: number) => {
    await ServerConnection.delete(`/boards/${id}/labels/${labelId}`);
    loadLabels();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log(e.clientX, e.clientY);
  };

  useEffect(() => {
    loadColumns();
    loadLabels();
  }, []);

  return (
    <div className="flex p-3 h-full" onPointerMove={handlePointerMove}>
      <h1>{name}</h1>
      {columns.map(({ id, name, position }) => (
        <Column
          key={id}
          id={id}
          name={name}
          position={position}
          availableLabels={labels}
          remove={removeColumn}
        />
      ))}

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="kolumnejm"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <button onClick={addColumn}>kolum</button>
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="nejm labejle"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
        />
        <input
          type="color"
          placeholder="kolór labejle"
          value={newLabelColor}
          onChange={(e) => setNewLabelColor(e.target.value)}
        />
        <button onClick={addLabel}>ejd leabje</button>
        {labels.map(({ id, name, color }) => (
          <Label
            key={id}
            id={id}
            name={name}
            color={color}
            remove={removeLabel}
          />
        ))}
      </div>

      <button onClick={() => remove(id)}>bord ziuuu</button>
    </div>
  );
}
