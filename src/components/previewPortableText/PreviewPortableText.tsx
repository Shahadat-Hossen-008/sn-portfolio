export const previewPortableTextComponents = {
  marks: {
    link: ({ children }: { children: React.ReactNode }) => {
      return <span className="text-gray-200">{children}</span>;
    },
  },
};
