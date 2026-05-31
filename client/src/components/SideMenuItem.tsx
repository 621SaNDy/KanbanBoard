type SideMenuItemProps = {
  icon: string;
  title: string;
  expanded?: boolean;
  active?: boolean;
  click: () => void;
};

export function SideMenuItem({
  icon,
  title,
  expanded = true,
  active = false,
  click,
}: SideMenuItemProps) {
  return (
    <div
      className={`flex items-center pl-4 pr-4 pt-2 pb-2 max-w-65 ${!active ? "hover:" : ""}bg-fg ${!active ? "hover:" : ""}text-bg`}
      onClick={click}
    >
      <i className={`hn hn-${icon}`} />
      <p
        className={`text-nowrap overflow-hidden text-ellipsis ${expanded ? "pl-3" : "w-0"}`}
      >
        {title}
      </p>
    </div>
  );
}
