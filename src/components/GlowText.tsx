import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

type GlowTextProps<T extends React.ElementType = React.ElementType> =
  OverrideProps<
    React.ComponentPropsWithRef<T>,
    {
      as?: T;
    }
  >;
export const GlowText = <T extends React.ElementType = "span">({
  as,
  className,
  children,
  ...rest
}: GlowTextProps<T>) => {
  const Tag = as || "span";
  return (
    <Tag className={cn("relative z-0", className)} {...rest}>
      <span className="relative z-10 text-white">{children}</span>
      <span
        className="absolute inset-0 -z-10 blur-sm bg-clip-text text-transparent bg-linear-to-r from-(--primary) to-(--secondary) drop-shadow-[0_0_15px_var(--tertiary)] select-none"
        aria-hidden="true"
      >
        {children}
      </span>
    </Tag>
  );
};
