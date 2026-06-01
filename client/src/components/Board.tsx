import { useEffect, useState } from "react";
import { Column } from "./Column";
import {
  type LabelModel,
  type BoardModel,
  type ColumnModel,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import { CardLabel } from "./CardLabel";
import type { ColumnRequest, LabelRequest } from "../types/requests";
import { HoverableIcon } from "./HoverableIcon";
import { TopMenu } from "./TopMenu";
import { ContextMenu } from "./ContextMenu";
import { CardLabelButton } from "./CardLabelButton";

type BoardProps = BoardModel & {
  editBoardName: (id: number, name: string) => void;
  removeBoard: (id: number) => void;
  isAutoEditEnabled?: boolean;
  setAutoEditUsed?: () => void;
};

export function Board({
  id,
  name,
  editBoardName,
  removeBoard,
  isAutoEditEnabled,
  setAutoEditUsed,
}: BoardProps) {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [labels, setLabels] = useState<LabelModel[]>([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("");
  const [cardsRefreshToken, setCardsRefreshToken] = useState(0);
  const [autoEditColumnId, setAutoEditColumnId] = useState(0);
  const [isLabelMenuOpen, setLabelMenuOpen] = useState(false);
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

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
    const newColumn: ColumnModel = await ServerConnection.post(
      `/boards/${id}/columns`,
      columnData,
    );
    setAutoEditColumnId(newColumn.id);
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

  const refreshColumns = () => {
    setCardsRefreshToken((value) => value + 1);
  };

  useEffect(() => {
    loadColumns();
    loadLabels();
  }, [id]);

  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0">
      <TopMenu
        board={{ id, name }}
        editBoardName={editBoardName}
        removeBoard={removeBoard}
        isLabelMenuOpen={isLabelMenuOpen}
        toggleLabelMenu={() => setLabelMenuOpen(!isLabelMenuOpen)}
        isFilterMenuOpen={isFilterMenuOpen}
        toggleFilterMenu={() => setFilterMenuOpen(!isFilterMenuOpen)}
        isAutoEditEnabled={isAutoEditEnabled}
        setAutoEditUsed={setAutoEditUsed}
      />
      <div className="relative flex flex-col gap-3 flex-1 min-h-0">
        <div
          className="flex gap-5 flex-1 min-h-0 overflow-x-auto"
          style={isLabelMenuOpen || isFilterMenuOpen ? { opacity: 0.1 } : {}}
        >
          {columns.map(({ id, name, position }) => (
            <Column
              key={id}
              id={id}
              name={name}
              position={position}
              availableLabels={labels}
              editName={editColumnName}
              remove={removeColumn}
              refreshBoard={refreshColumns}
              refreshToken={cardsRefreshToken}
              isAutoNameEditEnabled={autoEditColumnId === id}
              autoNameEditUsed={() => setAutoEditColumnId(0)}
            />
          ))}

          <button
            className="shadow-border-rounded inset-shadow-border m-border p-2"
            onClick={addColumn}
          >
            <HoverableIcon name="plus" useHover={false} />
          </button>
        </div>

        <div className="absolute z-1000 flex justify-end gap-5 flex-1 w-full h-full min-h-0">
          {isLabelMenuOpen && (
            <ContextMenu>
              <div className="flex flex-col p-3 gap-3">
                <h2 className="text-center">Board labels</h2>
                <div className="flex flex-col gap-1">
                  <input
                    className="border-3 border-fg border-solid w-full"
                    type="text"
                    placeholder="Label name..."
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                  />
                  <input
                    className="border-3 border-fg border-solid w-full"
                    type="color"
                    placeholder="Label color..."
                    value={newLabelColor}
                    onChange={(e) => setNewLabelColor(e.target.value)}
                  />
                  <button
                    className="shadow-border-rounded inset-shadow-border m-border flex justify-center p-1"
                    onClick={addLabel}
                  >
                    <HoverableIcon name="plus" useHover={false} />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
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
            </ContextMenu>
          )}
          {isFilterMenuOpen && (
            <ContextMenu>
              <div className="flex flex-col p-3 gap-3">
                <h2 className="text-center">Filters</h2>
                <div className="flex flex-col gap-1">
                  {labels.map(({ id, name, color }) => (
                    <CardLabelButton
                      key={id}
                      id={id}
                      name={name}
                      color={color}
                      click={() => {}}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-1">
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
            </ContextMenu>
          )}
        </div>
      </div>
    </div>
  );
}
