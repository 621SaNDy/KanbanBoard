type SideMenuItemProps = {
  icon: string;
  title: string;
  expanded?: boolean;
  click: () => void;
};

export function SideMenuItem({
  icon,
  title,
  expanded = true,
  click,
}: SideMenuItemProps) {
  return (
    <div className="flex items-center pl-4 pr-4 pt-2 pb-2" onClick={click}>
      <i className={`hn hn-${icon}`} />
      <p className={`text-nowrap overflow-hidden ${expanded ? "pl-3" : "w-0"}`}>
        {title}
      </p>
    </div>
  );
}
