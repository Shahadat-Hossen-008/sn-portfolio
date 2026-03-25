import { urlFor } from "@/sanity/lib/image";
import { YouTube } from "../youTube/YouTube";
import { PortableTextReactComponents } from "next-sanity";
import Image from "next/image";

export const portableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    youtube: ({ value }: { value: { url: string } }) => (
      <YouTube url={value.url} />
    ),

    customImage: (props) =>
      props.value ? (
        <Image
          className="rounded-lg h-auto my-10 mx-auto"
          src={urlFor(props.value.imageFile)
            .width(600)
            .height(400)
            .quality(80)
            .auto("format")
            .url()}
          alt={props?.value?.alt || ""}
          width={600}
          height={400}
        />
      ) : null,
  },

  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-2">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-7 mb-4 text-gray-300">{children}</p>
    ),
  },

  marks: {
    link: ({ value, children }) => {
      const href = value?.href?.href || "#";

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          {children}
        </a>
      );
    },
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4">{children}</ol>
    ),
  },
};
