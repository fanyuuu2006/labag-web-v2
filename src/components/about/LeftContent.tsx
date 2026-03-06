import { cn } from "@/utils/className";
import { AppstoreOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";

export type LeftContentProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    title: string;
    icon?: React.ElementType;
  }
>;

export const LeftContent = ({
  className,
  title,
  icon: Icon = AppstoreOutlined,
  children,
  ...rest
}: LeftContentProps) => {
  return (
    <div
      className={cn("flex flex-col gap-4 p-4", className)}
      {...rest}
    >
      <h3 className="text-xl font-bold flex items-center gap-3">
        <Icon />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
};
