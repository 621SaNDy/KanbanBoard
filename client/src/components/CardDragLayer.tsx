import { useDragLayer } from "react-dnd";
import { DateUtility } from "../utilities/DateUtility";
import type { DragCardItem } from "../types/dnd";
import { HoverableIcon } from "./HoverableIcon";
import { CardLabel } from "./CardLabel";

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
  if (
    !initialClientOffset ||
    !currentClientOffset ||
    !initialSourceClientOffset
  ) {
    return { display: "none" } as React.CSSProperties;
  }

  const x =
    currentClientOffset.x - initialClientOffset.x + initialSourceClientOffset.x;
  const y =
    currentClientOffset.y - initialClientOffset.y + initialSourceClientOffset.y;

  return {
    transform: `translate(${x}px, ${y}px)`,
  } as React.CSSProperties;
};

export function CardDragLayer() {
  const {
    item,
    isDragging,
    initialClientOffset,
    currentClientOffset,
    initialSourceClientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DragCardItem | null,
    isDragging: monitor.isDragging(),
    initialClientOffset: monitor.getInitialClientOffset(),
    currentClientOffset: monitor.getClientOffset(),
    initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
  }));

  if (!isDragging || !item || item.type !== "CARD") {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div
        style={{
          ...getItemStyles(
            initialClientOffset,
            currentClientOffset,
            initialSourceClientOffset,
          ),
          width: item.width,
          height: item.height,
        }}
      >
        <div className="shadow-border-rounded m-border inset-shadow-border bg-bg-dark flex flex-col relative">
          <div className="flex flex-col pl-3 pr-3 pt-2 pb-2 relative gap-2 w-full">
            <h3 className="select-none">{item.title}</h3>
            {item.description ? (
              <p className="whitespace-pre-wrap">{item.description}</p>
            ) : null}
            {item.labels.length ? (
              <div className="flex flex-wrap gap-2">
                {item.labels.map(({ id, name, color }) => (
                  <CardLabel key={id} id={id} name={name} color={color} />
                ))}
              </div>
            ) : null}
            {item.dueDate ? (
              <div className="flex gap-1 items-center">
                <HoverableIcon name="clock" useHover={false} />
                <p className="flex items-center gap-1 select-none">
                  {DateUtility.getAbsoluteDate(item.dueDate)}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
