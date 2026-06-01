import type { LabelModel } from "../types/models";
import { CardLabelButton } from "./CardLabelButton";
import { ContextMenu } from "./ContextMenu";
import { HoverableIcon } from "./HoverableIcon";

type BoardFilterMenuProps = {
  labels: LabelModel[];
  selectedLabelIds: number[];
  addFilter: (labelId: number) => void;
  removeFilter: (labelId: number) => void;
};

export function BoardFilterMenu({
  labels,
  selectedLabelIds,
  addFilter,
  removeFilter,
}: BoardFilterMenuProps) {
  const selectedLabels = labels.filter((label) =>
    selectedLabelIds.includes(label.id),
  );
  const availableLabels = labels.filter(
    (label) => !selectedLabelIds.includes(label.id),
  );

  return (
    <ContextMenu>
      <div className="flex flex-col p-3 gap-3 min-w-40 max-w-[15vw]">
        <h2 className="text-center">Filters</h2>
        <div className="outline-3 outline-fg outline-dashed min-h-4 flex flex-col gap-1 p-1">
          {selectedLabels.map(({ id, name, color }) => (
            <CardLabelButton
              key={id}
              id={id}
              name={name}
              color={color}
              icon="minus"
              click={() => removeFilter(id)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {availableLabels.map(({ id, name, color }) => (
            <CardLabelButton
              key={id}
              id={id}
              name={name}
              color={color}
              icon="plus"
              click={() => addFilter(id)}
            />
          ))}
        </div>
      </div>
    </ContextMenu>
  );
}
