import { defineLocations } from "sanity/presentation";

const fixedPage = (title: string, href: string) => ({
  locations: [{ title, href }],
});

export const previewLocations = {
  myProfilePage: defineLocations({ select: { title: "_type" }, resolve: () => fixedPage("Home", "/") }),
  aboutPage:      defineLocations({ select: { title: "_type" }, resolve: () => fixedPage("About", "/about") }),
  projectPage:    defineLocations({ select: { title: "_type" }, resolve: () => fixedPage("Projects", "/projects") }),
  blogPage:       defineLocations({ select: { title: "_type" }, resolve: () => fixedPage("Blog", "/blog") }),
  blogPost: defineLocations({
    select: { title: "blogTitle", slug: "slug.current" },
    resolve: (doc) =>{
      if(!doc){
        return undefined;
      }
      return doc.slug ? { locations: [{ title: doc.title ?? "Blog Post", href: `/blog/${doc.slug}` }] } : undefined;
    }
      
  }),
  project: defineLocations({
    select: { title: "projectTitle" },
    resolve: (doc) => {
      if (!doc) {
        return undefined;
      }
      return { locations: [{ title: doc.title ?? "Projects", href: "/projects" }] };
    },
  }),
};