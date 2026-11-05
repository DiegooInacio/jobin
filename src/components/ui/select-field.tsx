import type { SelectHTMLAttributes } from "react";
import { Icon, type IconName } from "./icon";

export function SelectField({
  active = false,
  icon = "filter",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  active?: boolean;
  icon?: IconName;
}) {
  return (
    <div className={`select-field${active ? " is-active" : ""}`}>
      <Icon
        name={icon}
        className="select-leading-icon"
        width="15"
        height="15"
      />
      <select {...props}>{children}</select>
      <Icon
        name="chevronDown"
        className="select-chevron"
        width="13"
        height="13"
      />
    </div>
  );
}
