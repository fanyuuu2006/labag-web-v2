import { OverrideProps } from "fanyucomponents";
import React, { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
type MyMarkDownProps = OverrideProps<
  React.ComponentPropsWithoutRef<typeof ReactMarkdown>,
  {
    /**
     * Markdown 內容中可使用的變數，格式為 `$variableName$`，會被替換為對應的值。
     * 例如，若傳入 `{ score: { a: 100 } }`，則 Markdown 中的 `$score.a$` 會被替換為 `100`。
     * 這允許在 Markdown 中動態顯示數據，提升內容的靈活性和互動性。
     */
    variables?: Record<string, unknown>;
  }
>;

const flattenVariables = (
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(
          acc,
          flattenVariables(value as Record<string, unknown>, newKey),
        );
      } else {
        acc[newKey] = String(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const MyMarkDown = memo(
  ({ variables, children, remarkPlugins, ...rest }: MyMarkDownProps) => {
    const processedChildren = useMemo(() => {
      if (!variables || typeof children !== "string") return children;

      const flatVariables = flattenVariables(variables);
      let result = children;

      for (const [key, value] of Object.entries(flatVariables)) {
        // 替換 $key$ 為對應的值
        // 使用 replaceAll 或者 regex replace
        // 此處 regex 需要跳脫特殊字元
        const regex = new RegExp(`\\$${key.replace(/\./g, "\\.")}\\$`, "g");
        result = result.replace(regex, value);
      }
      return result;
    }, [children, variables]);

    return (
      <ReactMarkdown
        // components={{
        //     p: ({...rest})=> <p className={'mb-4'} {...rest} />

        // }}
        remarkPlugins={[
          remarkGfm,
          remarkBreaks,
          ...(remarkPlugins ? remarkPlugins : []),
        ]}
        {...rest}
      >
        {processedChildren}
      </ReactMarkdown>
    );
  },
);
MyMarkDown.displayName = "MyMarkDown";
