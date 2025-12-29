import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

type ToggleSwitchProps = OverrideProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
  }
>;
export const ToggleSwitch = ({
  className,
  id,
  setValue,
  value,
}: ToggleSwitchProps) => {
  return (
    <label htmlFor={id} className={cn(className)}>
      <input
        id={id}
        className="sr-only peer"
        type="checkbox"
        role="switch"
        aria-checked={value}
        checked={value}
        onChange={() => setValue((prev) => !prev)}
      />
      <div
        className={cn(
          "relative h-[1.2em] w-[2.5em] flex items-center rounded-full cursor-pointer",
          "transition-all duration-200",
          "bg-gray-500 peer-checked:bg-(--text-color-secondary)"
        )}
      >
        <span
          className={cn(
            "h-full w-auto aspect-square bg-white rounded-full border border-gray-300 transition-all duration-200",
            "top-1/2 -translate-y-1/2 absolute left-0 peer-checked:left-auto peer-checked:right-0"
          )}
        />
      </div>
    </label>
  );
};
