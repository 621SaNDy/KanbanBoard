import { useState, type ChangeEvent } from "react";
import type { LabelModel } from "../types/models";
import { ContextMenu } from "./ContextMenu";
import { HoverableIcon } from "./HoverableIcon";
import { CardLabelButton } from "./CardLabelButton";

type BoardLabelMenuProps = {
  labels: LabelModel[];
  addLabel: (name: string, color: string) => void;
  removeLabel: (labelId: number) => void;
};

export function BoardLabelMenu({
  labels,
  addLabel,
  removeLabel,
}: BoardLabelMenuProps) {
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("");

  const handleAddLabel = () => {
    if (newLabelName.trim() !== "") {
      addLabel(newLabelName, newLabelColor);
    }
    setNewLabelName("");
    setNewLabelColor("");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewLabelName(e.target.value);
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewLabelColor(e.target.value);
  };

  const handleBlur = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <ContextMenu>
      <div className="flex flex-col pl-3 pr-3 pb-3 pt-2 gap-2 min-w-40 max-w-[15vw]">
        <h2 className="text-center">Labels</h2>
        <div className="flex flex-col gap-1">
          <input
            className="border-3 border-fg border-solid w-full min-w-0"
            type="text"
            placeholder="Enter the label name..."
            value={newLabelName}
            onChange={handleNameChange}
            onKeyDown={handleBlur}
          />
          <input
            className="border-3 border-fg border-solid w-full min-w-0"
            type="color"
            placeholder="Enter the label color..."
            value={newLabelColor}
            onChange={handleColorChange}
            onKeyDown={handleBlur}
          />
          <button
            className="shadow-border-rounded inset-shadow-border m-border flex justify-center p-1"
            onClick={handleAddLabel}
          >
            <HoverableIcon name="plus" useHover={false} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {labels.map(({ id, name, color }) => (
            <CardLabelButton
              key={id}
              id={id}
              name={name}
              color={color}
              icon="trash-alt"
              iconOnlyButton={true}
              click={removeLabel}
            />
          ))}
        </div>
      </div>
    </ContextMenu>
  );
}
