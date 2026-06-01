import { useDragLayer } from "react-dnd";
import type { DragColumnItem } from "../types/dnd";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 1000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

const getItemStyles = (
  initialClientOffset: { x: number; y: number } | null,
  currentClientOffset: { x: number; y: number } | null,
  initialSourceClientOffset: { x: number; y: number } | null,
) => {
  if (!initialClientOffset || !currentClientOffset || !initialSourceClientOffset) {
    return { display: "none" } as React.CSSProperties;
  }

  const x = currentClientOffset.x - initialClientOffset.x + initialSourceClientOffset.x;
  const y = currentClientOffset.y - initialClientOffset.y + initialSourceClientOffset.y;

  return {
    transform: `translate(${x}px, ${y}px)`,
  } as React.CSSProperties;
};

export function ColumnDragLayer() {
  const { item, isDragging, initialClientOffset, currentClientOffset, initialSourceClientOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem() as DragColumnItem | null,
      isDragging: monitor.isDragging(),
      initialClientOffset: monitor.getInitialClientOffset(),
      currentClientOffset: monitor.getClientOffset(),
      initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
    }));

  if (!isDragging || !item || item.type !== "COLUMN") {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div
        style={{
          ...getItemStyles(initialClientOffset, currentClientOffset, initialSourceClientOffset),
          width: item.width,
          height: item.height,
        }}
      >
        <div
          className="shadow-border-rounded m-border inset-shadow-border bg-bg-secondary flex items-center px-3 py-1"
          style={{ outline: "5px solid var(--color-fg)" }}
        >
          <h2 className="select-none text-center">{item.name}</h2>
        </div>
      </div>
    </div>
  );
}
