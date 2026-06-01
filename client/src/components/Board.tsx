import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { BoardColumn } from "./BoardColumn";
import {
  type LabelModel,
  type BoardModel,
  type ColumnModel,
} from "../types/models";
import { ServerConnection } from "../utilities/ServerConnection";
import { CardLabel } from "./CardLabel";
import { ColumnDropIndicator } from "./ColumnDropIndicator";
import { useDrop } from "react-dnd";
import { COLUMN_DND_TYPE, type DragColumnItem } from "../types/dnd";
import type { ColumnRequest, LabelRequest } from "../types/requests";

type BoardProps = BoardModel & {
  remove: (id: number) => void;
};

export function Board({ id, name, remove }: BoardProps) {
  const [columns, setColumns] = useState<ColumnModel[]>([]);
  const [labels, setLabels] = useState<LabelModel[]>([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("");
  const [cardsRefreshToken, setCardsRefreshToken] = useState(0);
  const [closestDropIndex, setClosestDropIndex] = useState<number | null>(null);
  const columnRefs = useRef(new Map<number, HTMLDivElement | null>());

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

  const refreshColumns = () => {
    setCardsRefreshToken((value) => value + 1);
  };

  const reorderColumns = async (orderedIds: number[]) => {
    await ServerConnection.patch(`/boards/${id}/columns/reorder`, {
      order: orderedIds,
    });
    loadColumns();
  };

  const getDropZoneIndex = (clientX: number) => {
    if (columns.length === 0) {
      return 0;
    }
    for (let index = 0; index < columns.length; index += 1) {
      const columnId = columns[index]?.id;
      if (!columnId) {
        continue;
      }
      const node = columnRefs.current.get(columnId);
      if (!node) {
        continue;
      }
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      if (clientX < centerX) {
        return Math.max(index, 0);
      }
    }
    return columns.length;
  };

  const getInsertionIndex = (zoneIndex: number, draggingIndex?: number) => {
    if (draggingIndex !== undefined && zoneIndex > draggingIndex) {
      return zoneIndex - 1;
    }
    return zoneIndex;
  };

  const getDropPlacement = (
    clientX: number | null,
    draggingIndex?: number,
  ) => {
    const zoneIndex = clientX !== null ? getDropZoneIndex(clientX) : columns.length;
    const insertionIndex = getInsertionIndex(zoneIndex, draggingIndex);
    return { zoneIndex, nextIndex: insertionIndex };
  };

  const [{ isOver }, dropRef] = useDrop<
    DragColumnItem,
    void,
    { isOver: boolean }
  >(
    () => ({
      accept: COLUMN_DND_TYPE,
      hover: (_, monitor) => {
        const offset = monitor.getClientOffset();
        if (!offset) {
          return;
        }
        setClosestDropIndex(getDropPlacement(offset.x).zoneIndex);
      },
      drop: (item, monitor) => {
        const placement = getDropPlacement(
          monitor.getClientOffset()?.x ?? null,
          item.fromIndex,
        );
        if (item.fromIndex === placement.nextIndex) {
          setClosestDropIndex(null);
          return;
        }
        const orderedIds = columns.map((column) => column.id);
        const currentIndex = orderedIds.indexOf(item.columnId);
        if (currentIndex === -1) {
          setClosestDropIndex(null);
          return;
        }
        orderedIds.splice(currentIndex, 1);
        orderedIds.splice(placement.nextIndex, 0, item.columnId);
        void reorderColumns(orderedIds);
        setClosestDropIndex(null);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [columns, id],
  );

  const dropTargetRef = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef(node);
    },
    [dropRef],
  );

  const setColumnRef = (columnId: number) => (node: HTMLDivElement | null) => {
    if (node) {
      columnRefs.current.set(columnId, node);
    } else {
      columnRefs.current.delete(columnId);
    }
  };

  useEffect(() => {
    loadColumns();
    loadLabels();
  }, [id]);

  useEffect(() => {
    if (!isOver) {
      setClosestDropIndex(null);
    }
  }, [isOver]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-5 flex-1">
        <div ref={dropTargetRef} className="flex gap-3 flex-1">
          <ColumnDropIndicator active={isOver && closestDropIndex === 0} />
          {columns.map(({ id, name, position }, index) => (
            <Fragment key={id}>
              <div ref={setColumnRef(id)} className="flex flex-1">
                <BoardColumn
                  id={id}
                  name={name}
                  position={position}
                  availableLabels={labels}
                  editName={editColumnName}
                  remove={removeColumn}
                  refreshBoard={refreshColumns}
                  refreshToken={cardsRefreshToken}
                  columnIndex={index}
                />
              </div>
              <ColumnDropIndicator
                active={isOver && closestDropIndex === index + 1}
              />
            </Fragment>
          ))}
        </div>

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
