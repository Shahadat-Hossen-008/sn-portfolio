import type { PreviewProps } from "sanity";
import { Flex, Text } from "@sanity/ui";

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;
  const getEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      let videoId = parsed.searchParams.get("v");
      if (parsed.hostname.includes("youtu.be")) {
        // Short URL: https://youtu.be/VIDEO_ID
        videoId = parsed.pathname.slice(1); // remove leading "/"
      } else {
        // Regular URL: https://www.youtube.com/watch?v=VIDEO_ID
        videoId = parsed.searchParams.get("v");
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof url === "string" ? (
        <iframe
          src={getEmbedUrl(url)}
          width="100%"
          height="300px"
          title="YouTube video"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <Text>Add a YouTube URL</Text>
      )}
    </Flex>
  );
}
