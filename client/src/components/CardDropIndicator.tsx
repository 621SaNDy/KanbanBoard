type DropIndicatorProps = {
  active: boolean;
};

export function CardDropIndicator({ active }: DropIndicatorProps) {
  return (
    <div
      className={`h-1 transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
    >
      <div className="h-full border-2 border-fg border-dashed" />
    </div>
  );
}
