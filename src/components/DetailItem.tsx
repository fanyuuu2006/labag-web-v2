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
    children?: never;
  }
>;

export const DetailItem = ({ detail, ...rest }: DetailItemProps) => {
  return (
    <div {...rest}>
      <span>{detail.content}</span>
      {detail.sub &&
        detail.sub.map((subDetail, index) => (
          <DetailItem
            className="ml-2 text-[0.8em]"
            key={index}
            detail={subDetail}
          />
        ))}
    </div>
  );
};
