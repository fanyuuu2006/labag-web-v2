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
          "h-[1.2em] w-[2.4em] flex items-center justify-center rounded-full cursor-pointer",
          "transition-colors duration-200",
          "bg-gray-500 peer-checked:bg-(--text-color-secondary) border border-black/20",
          'before:content-[""] before:h-full before:aspect-square before:bg-white before:rounded-full before:border before:border-gray-300',
          "before:transition-transform before:duration-200 before:-translate-x-1/2 peer-checked:before:translate-x-1/2"
        )}
      />
    </label>
  );
};
