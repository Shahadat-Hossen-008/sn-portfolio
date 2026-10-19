import { defineType, defineField } from "sanity";
import { PlayIcon } from "@sanity/icons";
import { YouTubePreview } from "./renderComponents";
import { isSupportedReactPlayerUrl } from "./videoUrl";


export const youtube = defineType({
  name: "youtube",
  type: "object",
  title: "YouTube Embed",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "Video URL",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          isSupportedReactPlayerUrl(value)
            ? true
            : "Enter an HTTPS URL supported by ReactPlayer.",
        ),
    }),
  ],
  preview: {
    select: { title: "url" },
  },
  components: {
    preview: YouTubePreview,
  },
});
