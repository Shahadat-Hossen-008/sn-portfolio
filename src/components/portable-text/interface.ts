import type {
  PortableTextBlock,
  PortableTextReactComponents,
} from "next-sanity";

export type IPortableTextComponents = Partial<PortableTextReactComponents>;

export interface IPortableTextTypedObject {
  _type: string;
  _key?: string;
}

export interface ICustomPortableTextProps<
  B extends IPortableTextTypedObject = PortableTextBlock,
> {
  value?: B | B[] | null;
  components?: IPortableTextComponents;
  className?: string;
}
