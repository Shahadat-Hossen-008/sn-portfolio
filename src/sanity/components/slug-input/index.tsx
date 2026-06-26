import { Text, Flex, Box } from "@sanity/ui";
import { HiOutlineExternalLink } from "react-icons/hi";

import {
  ObjectInputProps,
  SlugOptions,
  SlugSchemaType,
  SlugValue,
  useDataset,
} from "sanity";
import Link from "next/link";
import { getBaseUrl } from "@/sanity/utils";
import { IWorkspace } from "@/sanity/utils/type";

interface CustomSlugSchemaType extends Omit<SlugSchemaType, "options"> {
  options?: SlugOptions & {
    prefix?: string;
    isFixed?: boolean;
  };
}

type CustomSlugInputProps = ObjectInputProps<SlugValue, CustomSlugSchemaType>;

export default function SlugInput(props: CustomSlugInputProps) {
  const dataset = useDataset() as IWorkspace;
  const { renderDefault, value, schemaType } = props;
  let isFixed = false;

  if (schemaType.options && schemaType.options.isFixed) {
    isFixed = schemaType.options.isFixed;
  }

  const url: string[] = [getBaseUrl(dataset)];
  if (schemaType.options && schemaType.options.prefix) {
    url.push(schemaType.options.prefix);
  }

  if (value && value.current) {
    url.push(value.current);
  }

  return (
    <Flex gap={3} direction={"column"}>
      <Box
        flex={"auto"}
        style={{
          maxWidth: "fit-content",
        }}
        hidden={!isFixed && value?.current == undefined}
      >
        <Link
          href={url.join("/")}
          style={{ textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Flex gap={2} direction={"row"} align={"center"}>
            <Text size={isFixed ? 2 : 1} readOnly>
              {url
                .join("/")
                .replace(new RegExp("https?:\/\/[^\/]+\/studio"), "")}
            </Text>
            <Text size={1} readOnly>
              <HiOutlineExternalLink />
            </Text>
          </Flex>
        </Link>
      </Box>

      {!isFixed && renderDefault(props)}
    </Flex>
  );
}
