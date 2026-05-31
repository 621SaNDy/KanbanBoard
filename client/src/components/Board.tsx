import { useEffect, useState } from "react";
import { BoardColumn } from "./BoardColumn";
import {
  type LabelModel,
  type BoardModel,
  type ColumnModel,
  type ColumnRequest,
  type LabelRequest,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import { CardLabel } from "./CardLabel";

type BoardProps = BoardModel & {
  remove: (id: number) => void;
};

export function Board({ id, name, remove }: BoardProps) {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [labels, setLabels] = useState<LabelModel[]>([]);
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
    const columnData: ColumnRequest = { name: "New column" };
    await ServerConnection.post(`/boards/${id}/columns`, columnData);
    loadColumns();
  };

  const editColumnName = async (columnId: number, name: string) => {
    const columnData: ColumnRequest = { name: name };
    await ServerConnection.patch(`/columns/${columnId}`, columnData);
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
  }, [id]);

  return (
    <div
      className="flex flex-col gap-3 h-full" /*onPointerMove={handlePointerMove}*/
    >
      <div className="flex gap-5 flex-1">
        {columns.map(({ id, name, position }) => (
          <BoardColumn
            key={id}
            id={id}
            name={name}
            position={position}
            availableLabels={labels}
            editName={editColumnName}
            remove={removeColumn}
          />
        ))}

        <button
          className="shadow-border-rounded inset-shadow-border m-border p-2"
          onClick={addColumn}
        >
          <i className="hn hn-plus" />
        </button>
      </div>

      <div className="flex">
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
            <CardLabel
              key={id}
              id={id}
              name={name}
              color={color}
              remove={removeLabel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
