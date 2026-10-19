import { HeadingComponent } from "./renderComponents";
import { link } from "@/sanity/_root/link";

export const block = {
  name: "block",
  type: "block",
  title: "Block",
  styles: [
    {
      title: "Normal",
      value: "normal",
    },
    {
      title: "H1",
      value: "h1",
      component: HeadingComponent,
    },
    {
      title: "H2",
      value: "h2",
      component: HeadingComponent,
    },
    {
      title: "H3",
      value: "h3",
      component: HeadingComponent,
    },
    {
      title: "Quote",
      value: "blockquote",
    },
  ],
  lists: [
    {
      title: "Bullet",
      value: "bullet",
    },
    {
      title: "Number",
      value: "number",
    },
  ],
  marks: {
    decorators: [
      {
        title: "Strong",
        value: "strong",
      },
      {
        title: "Emphasis",
        value: "em",
      },
      {
        title: "Underline",
        value: "underline",
      },
    ],
    annotations: [link("linkUrl")],
  },
};
