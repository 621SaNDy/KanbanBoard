type ColumnDropIndicatorProps = {
  active: boolean;
};

export function ColumnDropIndicator({ active }: ColumnDropIndicatorProps) {
  return (
    <div
      className={`w-0 self-stretch transition-opacity ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-full border-2 border-fg border-dashed" />
    </div>
  );
}
