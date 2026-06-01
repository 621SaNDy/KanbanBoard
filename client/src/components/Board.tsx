import { useEffect, useState } from "react";
import { Column } from "./Column";
import {
  type LabelModel,
  type BoardModel,
  type ColumnModel,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import type { ColumnRequest, LabelRequest } from "../types/requests";
import { HoverableIcon } from "./HoverableIcon";
import { TopMenu } from "./TopMenu";
import { BoardLabelMenu } from "./BoardLabelMenu";
import { BoardFilterMenu } from "./BoardFilterMenu";

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
  const [filterLabelIds, setFilterLabelIds] = useState<number[]>([]);

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
    // Force a position refresh as the server doesn't perform it on delete
    await ServerConnection.patch(`/boards/${id}/columns/reorder`, {
      order: [],
    });
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

  const addFilterLabel = (labelId: number) => {
    setFilterLabelIds((current) =>
      current.includes(labelId) ? current : [...current, labelId],
    );
  };

  const removeFilterLabel = (labelId: number) => {
    setFilterLabelIds((current) => current.filter((id) => id !== labelId));
  };

  const isFilteringActive = isFilterMenuOpen && filterLabelIds.length > 0;

  useEffect(() => {
    loadColumns();
    loadLabels();
  }, [id]);

  useEffect(() => {
    setFilterLabelIds((current) =>
      current.filter((labelId) => labels.some((label) => label.id === labelId)),
    );
  }, [labels]);

  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0 min-w-0">
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
      <div className="relative flex gap-5 flex-1 min-h-0 min-w-0">
        <div className="flex gap-5 flex-1 min-h-0 min-w-0 h-full overflow-x-auto">
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
              filterLabelIds={filterLabelIds}
              isFilteringActive={isFilteringActive}
              isAutoNameEditEnabled={autoEditColumnId === id}
              autoNameEditUsed={() => setAutoEditColumnId(0)}
            />
          ))}
        </div>
        <button
          className={`shadow-border-rounded inset-shadow-border m-border p-2 ${
            isFilteringActive ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={isFilteringActive ? undefined : addColumn}
          disabled={isFilteringActive}
        >
          <HoverableIcon name="plus" useHover={false} />
        </button>

        {isLabelMenuOpen && (
          <BoardLabelMenu
            labels={labels}
            newLabelName={newLabelName}
            newLabelColor={newLabelColor}
            setNewLabelName={setNewLabelName}
            setNewLabelColor={setNewLabelColor}
            addLabel={addLabel}
            removeLabel={removeLabel}
          />
        )}
        {isFilterMenuOpen && (
          <BoardFilterMenu
            labels={labels}
            selectedLabelIds={filterLabelIds}
            addFilter={addFilterLabel}
            removeFilter={removeFilterLabel}
          />
        )}
      </div>
    </div>
  );
}
