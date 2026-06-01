import type { LabelModel } from "../types/models";
import { CardLabel } from "./CardLabel";
import { CardLabelButton } from "./CardLabelButton";
import { ContextMenu } from "./ContextMenu";

type BoardFilterMenuProps = {
  labels: LabelModel[];
  removeLabel: (labelId: number) => void;
};

export function BoardFilterMenu({
  labels,
  removeLabel,
}: BoardFilterMenuProps) {
  return (
    <ContextMenu>
      <div className="flex flex-col p-3 gap-3 min-w-20 max-w-[15vw]">
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
  );
}
