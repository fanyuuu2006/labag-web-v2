import { cn } from "@/utils/className";
import { AppstoreOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";

type ContentDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    title: string;
    description?: string;
    icon?: React.ElementType;
  }
>;

export const ContentDiv = ({
  className,
  title,
  description,
  icon: Icon = AppstoreOutlined,
  children,
  ...rest
}: ContentDivProps) => {
  return (
    <div className={cn("space-y-8 pb-12", className)} {...rest}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Icon />
          <span>{title}</span>
        </h2>
        {description && (
          <p className="flex flex-col text-(--muted) leading-relaxed max-w-2xl mx-auto">
            {description.split("\n").map((line, idx) => (
              <span key={idx}>{line}</span>
            ))}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};
