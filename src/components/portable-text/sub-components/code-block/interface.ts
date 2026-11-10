export interface IEditorialCodeBlockProps {
  code: string;
  language?: string;
  filename?: string | null;
}

export type CodeTokenType =
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "type"
  | "plain";

export interface ICodeToken {
  type: CodeTokenType;
  value: string;
}
