import type {
  CodeTokenType,
  ICodeToken,
  IEditorialCodeBlockProps,
} from "./interface";

const TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|import|export|from|default|async|await|try|catch|finally|throw|new|class|extends|implements|interface|type|enum|namespace|public|private|protected|readonly|static|typeof|keyof|in|of|as|satisfies|true|false|null|undefined|void|never|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|GROUP|ORDER|BY|LIMIT|CREATE|TABLE|INDEX|AND|OR|NOT|NULL|AS|ON|IN|IS|query|mutation|fragment)\b|\b(\d+(?:_\d+)*(?:\.\d+)?(?:e[+-]?\d+)?)\b|\b([A-Z][A-Za-z0-9_]*)\b/g;

/**
 * Deterministic, zero-dependency syntax tokenizer for editorial code blocks.
 * Preserves every character, space, and newline identically while classifying
 * comments, strings, language keywords, numbers, and types for WCAG AAA contrast
 * against the dark `soft-forest` surface.
 */
export function tokenizeCode(code: string, language?: string): ICodeToken[] {
  if (!code) return [];

  const normalizedLang = language?.toLowerCase().trim() ?? "";
  if (normalizedLang === "text" || normalizedLang === "plaintext") {
    return [{ type: "plain", value: code }];
  }

  const tokens: ICodeToken[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_REGEX)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      tokens.push({
        type: "plain",
        value: code.slice(lastIndex, matchIndex),
      });
    }

    const [fullMatch, comment, str, keyword, num, typeIdent] = match;
    let tokenType: CodeTokenType = "plain";

    if (comment !== undefined) {
      tokenType = "comment";
    } else if (str !== undefined) {
      tokenType = "string";
    } else if (keyword !== undefined) {
      tokenType = "keyword";
    } else if (num !== undefined) {
      tokenType = "number";
    } else if (typeIdent !== undefined) {
      tokenType = "type";
    }

    tokens.push({ type: tokenType, value: fullMatch });
    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "plain", value: code.slice(lastIndex) });
  }

  return tokens;
}

const TOKEN_CLASSES: Record<CodeTokenType, string> = {
  comment: "text-muted-sage italic",
  string: "text-lime",
  keyword: "text-mint font-medium",
  number: "text-soft-limestone",
  type: "text-soft-limestone",
  plain: "text-limestone",
};

/**
 * Shared accessible editorial code block used across top-level and nested Portable Text.
 *
 * - Uses the full available width of the editorial renderer (`w-full min-w-0`).
 * - Preserves indentation and line breaks (`whitespace-pre`) with horizontal scrolling (`overflow-x-auto`).
 * - Keyboard-accessible scroll region (`tabIndex={0}`, `role="region"`, `aria-label`) per WCAG 2.2 SC 2.1.1 / 2.4.7.
 * - Uses existing system/theme monospace stack (`font-mono`) and high-contrast theme tokens.
 */
export function EditorialCodeBlock({
  code,
  language,
  filename,
}: IEditorialCodeBlockProps) {
  const cleanFilename = filename?.trim() || null;
  const cleanLanguage = language?.trim() || undefined;
  const showHeader = Boolean(cleanFilename || cleanLanguage);
  const tokens = tokenizeCode(code, cleanLanguage);

  const regionLabel = cleanFilename
    ? `Code block: ${cleanFilename}`
    : cleanLanguage
      ? `${cleanLanguage} code snippet`
      : "Code snippet";

  return (
    <figure
      data-editorial-code="true"
      className="my-8 w-full min-w-0 overflow-hidden rounded-xl border border-limestone/15 bg-soft-forest text-limestone shadow-sm"
    >
      {showHeader && (
        <figcaption className="flex items-center justify-between gap-4 border-b border-limestone/10 bg-forest/50 px-4 py-2.5 sm:px-5 font-mono text-xs uppercase tracking-wider text-muted-sage">
          <span className="truncate">{cleanFilename || cleanLanguage}</span>
          {cleanFilename && cleanLanguage && (
            <span className="shrink-0 text-[11px] text-muted-sage/80">
              {cleanLanguage}
            </span>
          )}
        </figcaption>
      )}
      <pre
        tabIndex={0}
        role="region"
        aria-label={regionLabel}
        className="m-0 overflow-x-auto p-4 sm:p-5 font-mono text-sm leading-[1.65] text-limestone whitespace-pre focus-visible:outline-2 focus-visible:outline-mint focus-visible:-outline-offset-2"
      >
        <code
          className={cleanLanguage ? `language-${cleanLanguage}` : undefined}
        >
          {tokens.map((token, idx) =>
            token.type === "plain" ? (
              token.value
            ) : (
              <span key={idx} className={TOKEN_CLASSES[token.type]}>
                {token.value}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  );
}

export default EditorialCodeBlock;
