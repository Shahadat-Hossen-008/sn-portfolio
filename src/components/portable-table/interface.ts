import type { PortableTextBlock } from "next-sanity";

export interface IPortableTableHeader {
  _key?: string;
  label?: string | null;
}

export interface IPortableTableCell {
  _key?: string;
  content?: PortableTextBlock[] | null;
}

export interface IPortableTableRow {
  _key?: string;
  cells?: IPortableTableCell[] | null;
}

export interface IPortableTableProps {
  caption?: string | null;
  columnHeaders?: IPortableTableHeader[] | null;
  rows?: IPortableTableRow[] | null;
}
