import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

export type SelectorProps = OverrideProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  {
    id: string;
    options: {
      label: string;
      value: string;
    }[];
  }
>;

export const Selector = ({
  id,
  options,
  value,
  onChange,
  className,
  ...rest
}: SelectorProps) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={cn(
        "bg-black/50 border border-(--secondary) rounded-lg p-2 outline-none",
        className,
      )}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
