import type { ChangeEvent } from "react";
import type { LabelModel } from "../types/models";
import { CardLabel } from "./CardLabel";
import { ContextMenu } from "./ContextMenu";
import { HoverableIcon } from "./HoverableIcon";

type BoardLabelMenuProps = {
  labels: LabelModel[];
  newLabelName: string;
  newLabelColor: string;
  setNewLabelName: (value: string) => void;
  setNewLabelColor: (value: string) => void;
  addLabel: () => void;
  removeLabel: (labelId: number) => void;
};

export function BoardLabelMenu({
  labels,
  newLabelName,
  newLabelColor,
  setNewLabelName,
  setNewLabelColor,
  addLabel,
  removeLabel,
}: BoardLabelMenuProps) {
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewLabelName(event.target.value);
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewLabelColor(event.target.value);
  };

  return (
    <ContextMenu>
      <div className="flex flex-col p-3 gap-3 min-w-20 max-w-[15vw]">
        <h2 className="text-center">Board labels</h2>
        <div className="flex flex-col gap-1">
          <input
            className="border-3 border-fg border-solid w-full"
            type="text"
            placeholder="Label name..."
            value={newLabelName}
            onChange={handleNameChange}
          />
          <input
            className="border-3 border-fg border-solid w-full"
            type="color"
            placeholder="Label color..."
            value={newLabelColor}
            onChange={handleColorChange}
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
  );
}
