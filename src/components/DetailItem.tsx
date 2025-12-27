import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
import React from "react";

export type Detail = {
  content: React.ReactNode;
  sub?: Detail[];
};
type DetailItemProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    detail: Detail;
    children: never;
  }
>;

export const DetailItem = ({ detail, className, ...rest }: DetailItemProps) => {
  return (
    <div {...rest} className={cn("mb-2", className)}>
      <span className="mb-1">{detail.content}</span>
      {detail.sub &&
        detail.sub.map((subDetail, index) => (
          <DetailItem
            className={cn("ml-2 text-[0.8em]", className)}
            key={index}
            detail={subDetail}
            {...rest}
          />
        ))}
    </div>
  );
};
