/**
 *This file contains the components used to render the portable text link mark which is used to stop generate any links in the preview of the portable text, this is used to prevent any errors that may occur when trying to render links in the preview.
 */
export const previewPortableTextComponents = {
  marks: {
    link: ({ children }: { children: React.ReactNode }) => {
      return <span className="text-gray-200">{children}</span>;
    },
  },
};
