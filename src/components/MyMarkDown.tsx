import { OverrideProps } from "fanyucomponents";
import React, { memo, useMemo } from "react";

type MyMarkDownProps = OverrideProps<
  React.ComponentPropsWithoutRef<"div">,
  {
    /**
     * Markdown 內容中可使用的變數，格式為 `$variableName$`，會被替換為對應的值。
     * 例如，若傳入 `{ score: { a: 100 } }`，則 Markdown 中的 `$score.a$` 會被替換為 `100`。
     * 這允許在 Markdown 中動態顯示數據，提升內容的靈活性和互動性。
     */
    variables?: Record<string, unknown>;
    children: string;
    components?: Partial<
      Record<
        | `h${1 | 2 | 3 | 4 | 5 | 6}`
        | "li"
        | "blockquote"
        | "hr"
        | "blankline"
        | "p"
        | "strong"
        | "a"
        | "code"
        | "span"
        | "em",
        React.ElementType
      >
    >;
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

const parseInline = (
  text: string,
  components: MyMarkDownProps["components"],
): React.ReactNode[] => {
  if (!text) return [];

  const tokens: React.ReactNode[] = [];
  let currentText = text;
  let keyCounter = 0;
  while (currentText.length > 0) {
    // Link 連結 [text](url) - 連結內的文字也可以有樣式，所以也需要遞迴
    const linkMatch = currentText.match(/^\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const LinkTag = components?.a || "a";
      tokens.push(
        <LinkTag key={`link-${keyCounter++}`} href={linkMatch[2]}>
          {parseInline(linkMatch[1], components)}
        </LinkTag>,
      );
      currentText = currentText.slice(linkMatch[0].length);
      continue;
    }

    // Bold 粗體 **text** 或 __text__
    const boldMatch = currentText.match(/^\*\*(.*?)\*\*|^__(.*?)__/);
    if (boldMatch) {
      const content = boldMatch[1] || boldMatch[2];
      const StrongTag = components?.strong || "strong";
      tokens.push(
        <StrongTag key={`bold-${keyCounter++}`}>
          {parseInline(content, components)}
        </StrongTag>,
      );
      currentText = currentText.slice(boldMatch[0].length);
      continue;
    }

    // Italic 斜體 *text* 或 _text_ (但不匹配 **text** 或 __text__)
    const italicMatch = currentText.match(/^\*(?!\*)(.*?)\*|^_(?!_)(.*?)_/);
    if (italicMatch) {
      const content = italicMatch[1] || italicMatch[2];
      const ItalicTag = components?.em || "em";
      tokens.push(
        <ItalicTag key={`italic-${keyCounter++}`}>
          {parseInline(content, components)}
        </ItalicTag>,
      );
      currentText = currentText.slice(italicMatch[0].length);
      continue;
    }

    // Code 行內程式碼 `code`
    const codeMatch = currentText.match(/^`(.*?)`/);
    if (codeMatch) {
      const CodeTag = components?.code || "code";
      tokens.push(
        <CodeTag key={`code-${keyCounter++}`}>{codeMatch[1]}</CodeTag>,
      );
      currentText = currentText.slice(codeMatch[0].length);
      continue;
    }

    // 普通文字 - 直到下一個特殊標記為止
    const nextSpecialIndex = currentText.search(/(\*\*|__|\*|_|`|\[)/); // 搜尋下一個特殊標記的位置
    const SpanTag = components?.span || "span";
    if (nextSpecialIndex === -1) {
      tokens.push(
        <SpanTag key={`text-${keyCounter++}`}>{currentText}</SpanTag>,
      );
      break;
    } else {
      tokens.push(
        <SpanTag key={`text-${keyCounter++}`}>
          {currentText.slice(0, nextSpecialIndex)}
        </SpanTag>,
      );
      currentText = currentText.slice(nextSpecialIndex);
    }
  }

  return tokens;
};

// 解析區塊 (Headers, Lists, Paragraphs)
const parseBlocks = (
  text: string,
  components: MyMarkDownProps["components"],
): React.ReactNode[] => {
  const lines: string[] = text.split("\n");
  const blocks: React.ReactNode[] = [];
  // 使用一個全局計數器來生成唯一的 key
  let keyCounter: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Header標題 (#, ##, ###, etc.)
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level =
        `h${headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6}` as const;
      const content = parseInline(headerMatch[2], components);
      const HeaderTag = components?.[level] || level;

      blocks.push(
        <HeaderTag key={`header-${keyCounter++}`} className={`font-bold`}>
          {content}
        </HeaderTag>,
      );
      continue;
    }

    // List 列表 (-, *)
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      const content = parseInline(listMatch[1], components);
      const LiTag = components?.li || "div";
      blocks.push(
        <LiTag role="listitem" key={`list-${keyCounter++}`}>
          {content}
        </LiTag>,
      );
      continue;
    }

    // Blockquote 引用 (> )
    const quoteMatch = line.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      const content = parseInline(quoteMatch[1], components);
      const QuoteTag = components?.blockquote || "blockquote";
      blocks.push(<QuoteTag key={`quote-${keyCounter++}`}>{content}</QuoteTag>);
      continue;
    }

    // horizontal rule 水平線 (---, ***)
    const hrMatch = line.match(/^(-{3,}|\*{3,})$/);
    if (hrMatch) {
      const HrTag = components?.hr || "hr";
      blocks.push(<HrTag key={`hr-${keyCounter++}`} />);
      continue;
    }

    // Blank line 空行
    if (line.trim() === "") {
      const BlankLineTag = components?.blankline || "div";
      blocks.push(
        <BlankLineTag key={`blank-${keyCounter++}`} className="h-[1em]" />,
      );
      continue;
    }

    // 普通段落
    const content = parseInline(line, components);
    const ParagraphTag = components?.p || "p";
    blocks.push(
      <ParagraphTag key={`paragraph-${keyCounter++}`}>{content}</ParagraphTag>,
    );
  }
  return blocks;
};

export const MyMarkDown = memo(
  ({ variables, children, components, ...rest }: MyMarkDownProps) => {
    const processedContent = useMemo(() => {
      let result = children;
      if (variables) {
        const flatVariables = flattenVariables(variables);
        for (const [key, value] of Object.entries(flatVariables)) {
          // 替換 $key$ 為對應的值
          // 這裡需要對 key 進行跳脫，以防 key 中包含正則特殊字符
          const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`\\$${escapedKey}\\$`, "g");
          result = result.replace(regex, value);
        }
      }
      return parseBlocks(result, components);
    }, [children, components, variables]);

    return <div {...rest}>{processedContent}</div>;
  },
);
MyMarkDown.displayName = "MyMarkDown";
