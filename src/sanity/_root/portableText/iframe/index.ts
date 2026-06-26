import { defineType, defineField } from "sanity";
import { PlayIcon } from "@sanity/icons";
import { YouTubePreview } from "./renderComponents";


export const youtube = defineType({
  name: "youtube",
  type: "object",
  title: "YouTube Embed",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube video URL",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return "A YouTube URL is required";
          }

          try {
            const parsed = new URL(value);
            const host = parsed.hostname.toLowerCase();

            const isYouTubeHost =
              host === "youtube.com" ||
              host === "www.youtube.com" ||
              host.endsWith(".youtube.com") ||
              host === "youtu.be";

            if (!isYouTubeHost) {
              return "URL must be a YouTube URL (youtube.com or youtu.be)";
            }

            return true;
          } catch {
            return "Invalid URL format";
          }
        }),
    }),
  ],
  preview: {
    select: { title: "url" },
  },
  components: {
    preview: YouTubePreview,
  },
});
