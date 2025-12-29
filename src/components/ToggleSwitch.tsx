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
          "h-[1.2em] w-[2.5em] p-0.5 flex items-center rounded-full cursor-pointer",
          "justify-start peer-checked:justify-end",
          "transition-all duration-200",
          "bg-gray-300 peer-checked:bg-(--text-color-secondary)"
        )}
      >
        <span
          className={cn(
            "h-full w-auto aspect-square bg-white rounded-full",
            "transform transition-transform duration-200"
          )}
        />
      </div>
    </label>
  );
};
