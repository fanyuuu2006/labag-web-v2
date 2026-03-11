import { OverrideProps } from "fanyucomponents";
import React, { memo, useMemo } from "react";
import { MyImage } from "./MyImage";

/**
 * MyMarkDown 元件的屬性介面
 * 繼承自 `div` 的屬性，並允許覆寫
 */
type MyMarkDownProps = OverrideProps<
  React.ComponentPropsWithoutRef<"div">,
  {
    /**
     * Markdown 內容中可使用的變數，格式為 `$variableName$`，會被替換為對應的值。
     * 支援嵌套物件，例如 `{ score: { a: 100 } }`，則 `$score.a$` 會被替換為 `100`。
     * 這允許在 Markdown 中動態顯示數據，提升內容的靈活性和互動性。
     */
    variables?: Record<string, unknown>;
    /**
     * 要渲染的 Markdown 格式字串
     */
    children: string;
    /**
     * 自定義 Markdown 語法對應的 React 元件
     * 允許替換預設的 HTML 標籤渲染，例如將 `a` 標籤換成 Next.js 的 `Link`，或是自定義 `code` 區塊的樣式。
     */
    components?: Partial<
      Record<
        | `h${1 | 2 | 3 | 4 | 5 | 6}`
        | "li"
        | "ul"
        | "ol"
        | "blockquote"
        | "hr"
        | "blankline"
        | "p"
        | "strong"
        | "a"
        | "code"
        | "pre"
        | "span"
        | "em"
        | "img"
        | "div",
        React.ElementType
      >
    >;
  }
>;

/**
 * 將巢狀物件展平為單層物件，用於變數替換
 * @param obj 原始巢狀物件
 * @param prefix 當前遞迴的前綴 key
 * @returns 展平後的物件，key 為類似 `a.b.c` 的格式，value 為字串化後的值
 */
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

/**
 * 解析行內 Markdown 元素 (Inline Elements)
 * 支援：圖片, 連結, 粗體, 斜體, 行內程式碼
 *
 * @param text 要解析的文字行
 * @param components 自定義元件對照表
 * @returns 解析後的 ReactNode 陣列
 */
const parseInline = (
  text: string,
  components: MyMarkDownProps["components"],
): React.ReactNode[] => {
  if (!text) return [];

  const tokens: React.ReactNode[] = [];
  let currentText = text;
  let keyCounter = 0;

  while (currentText.length > 0) {
    // 1. Image 圖片 ![alt](url)
    const imgMatch = currentText.match(/^!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      const ImgTag = components?.img || MyImage;
      tokens.push(
        <ImgTag
          key={`img-${keyCounter++}`}
          src={imgMatch[2]}
          alt={imgMatch[1]}
        />,
      );
      currentText = currentText.slice(imgMatch[0].length);
      continue;
    }

    // 2. Link 連結 [text](url) - 連結內的文字也可以有樣式，所以也需要遞迴解析
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

    // 3. Bold 粗體 **text** 或 __text__
    const boldMatch = currentText.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      const content = boldMatch[2];
      const StrongTag = components?.strong || "strong";
      tokens.push(
        <StrongTag key={`bold-${keyCounter++}`}>
          {parseInline(content, components)}
        </StrongTag>,
      );
      currentText = currentText.slice(boldMatch[0].length);
      continue;
    }

    // 4. Italic 斜體 *text* 或 _text_
    const italicMatch = currentText.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      const content = italicMatch[2];
      const ItalicTag = components?.em || "em";
      tokens.push(
        <ItalicTag key={`italic-${keyCounter++}`}>
          {parseInline(content, components)}
        </ItalicTag>,
      );
      currentText = currentText.slice(italicMatch[0].length);
      continue;
    }

    // 5. Code 行內程式碼 `code`
    const codeMatch = currentText.match(/^`([^`]+)`/);
    if (codeMatch) {
      const CodeTag = components?.code || "code";
      tokens.push(
        <CodeTag key={`code-${keyCounter++}`}>{codeMatch[1]}</CodeTag>,
      );
      currentText = currentText.slice(codeMatch[0].length);
      continue;
    }

    // 優化: 尋找下一個特殊符號的位置，避免逐字處理
    const match = currentText.match(/(\*\*|__|\*|_|`|\[|!\[)/);
    const nextSpecialIndex = match ? match.index! : -1;

    const SpanTag = components?.span || "span";

    if (nextSpecialIndex === -1) {
      // 剩餘的全是普通文字
      tokens.push(
        <SpanTag key={`text-${keyCounter++}`}>{currentText}</SpanTag>,
      );
      break;
    } else if (nextSpecialIndex > 0) {
      // 特殊符號前有一段文字，先截取這段文字
      tokens.push(
        <SpanTag key={`text-${keyCounter++}`}>
          {currentText.slice(0, nextSpecialIndex)}
        </SpanTag>,
      );
      currentText = currentText.slice(nextSpecialIndex);
    } else {
      // nextSpecialIndex === 0，但上方所有 regex 規則都沒有匹配成功 (fallback case)
      // 這通常是像 "a [ b" 這種未閉合的情況，將第一個字元視為普通文字繼續處理
      tokens.push(
        <SpanTag key={`text-${keyCounter++}`}>{currentText[0]}</SpanTag>,
      );
      currentText = currentText.slice(1);
    }
  }

  return tokens;
};

/**
 * 解析區塊 Markdown 元素 (Block Elements)
 * 支援：程式碼區塊, 標題, 列表 (有序/無序), 引用區塊, 水平線, 空行, 段落
 *
 * @param text 完整的 Markdown 文字
 * @param components 自定義元件對照表
 * @returns 解析後的 ReactNode 陣列
 */
const parseBlocks = (
  text: string,
  components: MyMarkDownProps["components"],
): React.ReactNode[] => {
  const lines: string[] = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let keyCounter: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code Block 程式碼區塊 (```lang ... ```)
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      let codeContent = "";
      let j = i + 1;
      // 尋找閉合的 ```
      while (j < lines.length && !lines[j].trim().startsWith("```")) {
        codeContent += lines[j] + (j < lines.length - 1 ? "\n" : "");
        j++;
      }
      i = j; // 更新外層迴圈 index 到閉合處

      const PreTag = components?.pre || "pre";
      const CodeTag = components?.code || "code";
      blocks.push(
        <PreTag key={`codeblock-${keyCounter++}`}>
          <CodeTag className={lang ? `language-${lang}` : undefined}>
            {codeContent}
          </CodeTag>
        </PreTag>,
      );
      continue;
    }

    // 2. Header 標題 (#, ##, ...)
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level =
        `h${headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6}` as const;
      const content = parseInline(headerMatch[2], components);
      const HeaderTag = components?.[level] || level;

      blocks.push(
        <HeaderTag key={`header-${keyCounter++}`} className="font-bold">
          {content}
        </HeaderTag>,
      );
      continue;
    }

    // 3. List 列表 (-, *, 1.) - 支援自動合併連續的列表項目並包裹 ul/ol
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const isOrdered = /^\d+\./.test(listMatch[2]);
      const ListTag = isOrdered
        ? components?.ol || "ol"
        : components?.ul || "ul";
      const LiTag = components?.li || "li";

      const listItems: React.ReactNode[] = [];

      // 向後尋找並收集所有連續的同類型列表項
      let j = i;
      while (j < lines.length) {
        const nextLine = lines[j];
        const nextMatch = nextLine.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);

        if (!nextMatch) break;

        // 檢查列表類型是否一致 (ordered vs unordered)
        const nextIsOrdered = /^\d+\./.test(nextMatch[2]);
        if (nextIsOrdered !== isOrdered) break;

        const content = parseInline(nextMatch[3], components);
        listItems.push(
          <LiTag key={`li-${keyCounter++}-${j}`} role="listitem">
            {content}
          </LiTag>,
        );
        j++;
      }
      i = j - 1; // 更新外層迴圈 index 到最後一個列表項

      blocks.push(
        <ListTag
          key={`list-${keyCounter++}`}
          className={isOrdered ? "list-decimal ml-[1.25em]" : "list-disc ml-[1.25em]"}
        >
          {listItems}
        </ListTag>,
      );
      continue;
    }

    // 4. Blockquote 引用 (> )
    const quoteMatch = line.match(/^>\s+(.*)$/);
    if (quoteMatch) {
      const content = parseInline(quoteMatch[1], components);
      const QuoteTag = components?.blockquote || "blockquote";
      blocks.push(<QuoteTag key={`quote-${keyCounter++}`}>{content}</QuoteTag>);
      continue;
    }

    // 5. Horizontal rule 水平線 (--- or ***)
    const hrMatch = line.match(/^(-{3,}|\*{3,})$/);
    if (hrMatch) {
      const HrTag = components?.hr || "hr";
      blocks.push(<HrTag key={`hr-${keyCounter++}`} />);
      continue;
    }

    // 6. Blank line 空行
    if (line.trim() === "") {
      const BlankLineTag = components?.blankline || "div";
      blocks.push(
        <BlankLineTag key={`blank-${keyCounter++}`} className="h-[1em]" />,
      );
      continue;
    }

    // 7. 普通段落 (Fallback)
    const content = parseInline(line, components);
    const ParagraphTag = components?.p || "p";
    blocks.push(
      <ParagraphTag key={`paragraph-${keyCounter++}`}>{content}</ParagraphTag>,
    );
  }
  return blocks;
};

/**
 * 簡易的 Markdown 渲染元件
 *
 * @component
 * @example
 * ```tsx
 * <MyMarkDown
 *   variables={{ name: "User" }}
 *   components={{ h1: ({ children }) => <h1 className="text-xl">{children}</h1> }}
 * >
 *   # Hello, $name$!
 * </MyMarkDown>
 * ```
 */
export const MyMarkDown = memo(
  ({ variables, children, components, ...rest }: MyMarkDownProps) => {
    const processedContent = useMemo(() => {
      if (!children) return null;
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
